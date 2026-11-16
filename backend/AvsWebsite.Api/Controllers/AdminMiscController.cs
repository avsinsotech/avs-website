using System.Security.Claims;
using AvsWebsite.Api.Data;
using AvsWebsite.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AvsWebsite.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/admin")]
public sealed class AdminMiscController(DbHelper db, IWebHostEnvironment env, IConfiguration config, AuditService audit) : ControllerBase
{
    private static readonly Dictionary<string, string> AllowedTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        [".jpg"] = "image/jpeg", [".jpeg"] = "image/jpeg", [".png"] = "image/png", [".webp"] = "image/webp", [".svg"] = "image/svg+xml",
        [".pdf"] = "application/pdf", [".mp4"] = "video/mp4",
    };

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var c = await db.QuerySingleAsync(@"
SELECT (SELECT COUNT(*) FROM dbo.Leads) AS TotalLeads,
       (SELECT COUNT(*) FROM dbo.Leads WHERE Status='New') AS NewLeads,
       (SELECT COUNT(*) FROM dbo.Leads WHERE FormType='demo') AS DemoRequests,
       (SELECT COUNT(*) FROM dbo.ContentItems WHERE ContentType='products') AS Products,
       (SELECT COUNT(*) FROM dbo.ContentItems WHERE ContentType='articles') AS Articles");
        var recent = await db.QueryAsync("SELECT TOP 5 Id, FormType, Name, Organisation, ProductInterest, Status, CreatedAt FROM dbo.Leads ORDER BY CreatedAt DESC");
        return Ok(new
        {
            totalLeads = c!["TotalLeads"], newLeads = c["NewLeads"], demoRequests = c["DemoRequests"], products = c["Products"], articles = c["Articles"],
            recent = recent.Select(AdminLeadsController.Camel),
        });
    }

    [HttpPost("uploads")]
    [RequestSizeLimit(25 * 1024 * 1024)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0) return BadRequest(new { message = "No file uploaded." });
        if (file.Length > config.GetValue("Uploads:MaxBytes", 20 * 1024 * 1024)) return BadRequest(new { message = "File is too large (max 20 MB)." });
        var ext = Path.GetExtension(file.FileName);
        if (!AllowedTypes.ContainsKey(ext)) return BadRequest(new { message = "File type not allowed. Use JPG, PNG, WEBP, SVG, PDF or MP4." });

        var rel = Path.Combine("uploads", DateTime.UtcNow.ToString("yyyy"), DateTime.UtcNow.ToString("MM"));
        var root = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var dir = Path.Combine(root, rel);
        Directory.CreateDirectory(dir);
        var name = $"{Guid.NewGuid():N}{ext.ToLowerInvariant()}";
        await using (var fs = System.IO.File.Create(Path.Combine(dir, name))) await file.CopyToAsync(fs);

        var url = $"{config["Uploads:PublicBaseUrl"]?.TrimEnd('/')}/{rel.Replace('\\', '/')}/{name}";
        await audit.LogAsync(User, "upload", "file", url);
        return Ok(new { url });
    }

    public sealed record ChangePassword(string CurrentPassword, string NewPassword);

    [HttpPost("me/password")]
    public async Task<IActionResult> ChangeMyPassword([FromBody] ChangePassword req)
    {
        if (req.NewPassword.Length < 10) return BadRequest(new { message = "New password must be at least 10 characters." });
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        var u = await db.QuerySingleAsync("SELECT PasswordHash FROM dbo.AdminUsers WHERE Id=@Id", new { Id = id });
        if (u is null || !PasswordHasher.Verify(req.CurrentPassword, (string)u["PasswordHash"]!)) return BadRequest(new { message = "Current password is incorrect." });
        await db.ExecuteAsync("UPDATE dbo.AdminUsers SET PasswordHash=@H WHERE Id=@Id", new { H = PasswordHasher.Hash(req.NewPassword), Id = id });
        await audit.LogAsync(User, "change-password", "admin-user", id);
        return NoContent();
    }
}
