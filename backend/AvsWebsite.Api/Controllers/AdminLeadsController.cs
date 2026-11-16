using System.Text;
using AvsWebsite.Api.Data;
using AvsWebsite.Api.Models;
using AvsWebsite.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AvsWebsite.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/admin/leads")]
public sealed class AdminLeadsController(DbHelper db, AuditService audit) : ControllerBase
{
    private const string Cols = "Id, FormType, Name, Organisation, Designation, Mobile, Email, InstitutionType, ProductInterest, Message, Status, Notes, SourcePage, EmailSent, CreatedAt";

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? q, [FromQuery] string? status, [FromQuery] string? formType, [FromQuery] int page = 1, [FromQuery] int pageSize = 200)
    {
        pageSize = Math.Clamp(pageSize, 1, 500);
        var where = @"WHERE (@Status IS NULL OR Status = @Status)
  AND (@FormType IS NULL OR FormType = @FormType)
  AND (@Q IS NULL OR Name LIKE @Q OR Organisation LIKE @Q OR Email LIKE @Q OR Mobile LIKE @Q)";
        var args = new { Status = Clean(status), FormType = Clean(formType), Q = Clean(q) is { } s ? $"%{s}%" : null, Skip = (Math.Max(page, 1) - 1) * pageSize, Take = pageSize };
        var items = await db.QueryAsync($"SELECT {Cols} FROM dbo.Leads {where} ORDER BY CreatedAt DESC OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY", args);
        var total = await db.ScalarAsync<int>($"SELECT COUNT(*) FROM dbo.Leads {where}", args);
        return Ok(new { items = items.Select(Camel), total });
    }

    [HttpPatch("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] LeadPatch patch)
    {
        var n = await db.ExecuteAsync(
            "UPDATE dbo.Leads SET Status = COALESCE(@Status, Status), Notes = COALESCE(@Notes, Notes), UpdatedAt = SYSUTCDATETIME() WHERE Id = @Id",
            new { patch.Status, patch.Notes, Id = id });
        if (n == 0) return NotFound();
        await audit.LogAsync(User, "update", "lead", id.ToString());
        return NoContent();
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export()
    {
        var rows = await db.QueryAsync($"SELECT {Cols} FROM dbo.Leads ORDER BY CreatedAt DESC");
        var sb = new StringBuilder();
        var cols = Cols.Split(", ");
        sb.AppendLine(string.Join(",", cols));
        foreach (var r in rows)
            sb.AppendLine(string.Join(",", cols.Select(c => "\"" + Convert.ToString(r[c])?.Replace("\"", "\"\"") + "\"")));
        await audit.LogAsync(User, "export", "leads");
        return File(Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray(), "text/csv", $"avs-enquiries-{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    private static string? Clean(string? s) => string.IsNullOrWhiteSpace(s) ? null : s.Trim();

    internal static Dictionary<string, object?> Camel(Dictionary<string, object?> r) =>
        r.ToDictionary(kv => char.ToLowerInvariant(kv.Key[0]) + kv.Key[1..], kv => kv.Value);
}
