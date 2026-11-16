using AvsWebsite.Api.Data;
using AvsWebsite.Api.Models;
using AvsWebsite.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AvsWebsite.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(DbHelper db, TokenService tokens) : ControllerBase
{
    private const int MaxFailures = 5;

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var u = await db.QuerySingleAsync(
            "SELECT Id, Name, Email, PasswordHash, Role, IsActive, FailedAttempts, LockoutUntil FROM dbo.AdminUsers WHERE Email = @Email",
            new { req.Email });

        if (u is null || !(bool)u["IsActive"]!)
            return Unauthorized(new { message = "Invalid email or password." });

        if (u["LockoutUntil"] is DateTime until && until > DateTime.UtcNow)
            return StatusCode(423, new { message = "Account temporarily locked. Try again in 15 minutes." });

        if (!PasswordHasher.Verify(req.Password, (string)u["PasswordHash"]!))
        {
            var failures = (int)u["FailedAttempts"]! + 1;
            await db.ExecuteAsync(
                "UPDATE dbo.AdminUsers SET FailedAttempts = @F, LockoutUntil = CASE WHEN @F >= @Max THEN DATEADD(MINUTE, 15, SYSUTCDATETIME()) ELSE NULL END WHERE Id = @Id",
                new { F = failures, Max = MaxFailures, Id = u["Id"] });
            return Unauthorized(new { message = "Invalid email or password." });
        }

        await db.ExecuteAsync("UPDATE dbo.AdminUsers SET FailedAttempts = 0, LockoutUntil = NULL, LastLoginAt = SYSUTCDATETIME() WHERE Id = @Id", new { Id = u["Id"] });
        var token = tokens.Create((int)u["Id"]!, (string)u["Name"]!, (string)u["Email"]!, (string)u["Role"]!);
        return Ok(new { token, user = new { name = u["Name"], email = u["Email"], role = u["Role"] } });
    }
}
