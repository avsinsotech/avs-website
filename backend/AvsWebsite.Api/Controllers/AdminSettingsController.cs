using System.Text.Json.Nodes;
using AvsWebsite.Api.Data;
using AvsWebsite.Api.Models;
using AvsWebsite.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace AvsWebsite.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/admin/settings/{group}")]
public sealed class AdminSettingsController(DbHelper db, AuditService audit, IOutputCacheStore cache) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(string group)
    {
        if (!SettingsGroups.All.Contains(group)) return NotFound();
        var r = await db.QuerySingleAsync("SELECT ValueJson FROM dbo.SiteSettings WHERE GroupKey=@G", new { G = group.ToLowerInvariant() });
        return Content(r is null ? "{}" : (string)r["ValueJson"]!, "application/json");
    }

    [HttpPut]
    public async Task<IActionResult> Put(string group, [FromBody] JsonObject body)
    {
        if (!SettingsGroups.All.Contains(group)) return NotFound();
        await db.ExecuteAsync(@"
MERGE dbo.SiteSettings AS t USING (SELECT @G AS GroupKey) AS s ON t.GroupKey = s.GroupKey
WHEN MATCHED THEN UPDATE SET ValueJson = @V, UpdatedAt = SYSUTCDATETIME(), UpdatedBy = @By
WHEN NOT MATCHED THEN INSERT (GroupKey, ValueJson, UpdatedBy) VALUES (@G, @V, @By);",
            new { G = group.ToLowerInvariant(), V = body.ToJsonString(), By = User.Identity?.Name });
        await audit.LogAsync(User, "update", "settings", group);
        await cache.EvictByTagAsync("content", default);
        return NoContent();
    }
}
