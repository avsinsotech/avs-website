using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using AvsWebsite.Api.Data;
using AvsWebsite.Api.Models;
using AvsWebsite.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace AvsWebsite.Api.Controllers;

/// <summary>
/// Generic CMS endpoints for products, categories, solutions, articles, FAQs and media.
/// Each item is stored as JSON in dbo.ContentItems with indexed Slug / Title / SortOrder / IsPublished columns.
/// </summary>
[ApiController]
[Authorize]
[Route("api/admin/{type}")]
public sealed partial class AdminContentController(DbHelper db, AuditService audit, IOutputCacheStore cache) : ControllerBase
{
    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")] private static partial Regex SlugRx();

    [HttpGet]
    public async Task<IActionResult> List(string type)
    {
        if (!ContentTypes.All.Contains(type)) return NotFound();
        var rows = await db.QueryAsync("SELECT Id, DataJson, IsPublished, SortOrder FROM dbo.ContentItems WHERE ContentType = @T ORDER BY SortOrder, Title", new { T = type.ToLowerInvariant() });
        return Ok(rows.Select(ToItem));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(string type, int id)
    {
        var r = await db.QuerySingleAsync("SELECT Id, DataJson, IsPublished, SortOrder FROM dbo.ContentItems WHERE ContentType = @T AND Id = @Id", new { T = type.ToLowerInvariant(), Id = id });
        return r is null ? NotFound() : Ok(ToItem(r));
    }

    [HttpPost]
    public async Task<IActionResult> Create(string type, [FromBody] JsonObject body)
    {
        if (!ContentTypes.All.Contains(type)) return NotFound();
        var (err, cols) = Extract(type, body);
        if (err is not null) return BadRequest(new { message = err });
        if (cols.Slug is not null && await SlugTaken(type, cols.Slug, null)) return Conflict(new { message = "This URL slug is already in use." });

        var id = await db.ScalarAsync<int>(@"
INSERT INTO dbo.ContentItems (ContentType, Slug, Title, SortOrder, IsPublished, DataJson, UpdatedBy)
OUTPUT INSERTED.Id VALUES (@T, @Slug, @Title, @SortOrder, @IsPublished, @DataJson, @By)",
            new { T = type.ToLowerInvariant(), cols.Slug, cols.Title, cols.SortOrder, cols.IsPublished, cols.DataJson, By = User.Identity?.Name });
        await audit.LogAsync(User, "create", type, id.ToString());
        await cache.EvictByTagAsync("content", default);
        return Ok(new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(string type, int id, [FromBody] JsonObject body)
    {
        if (!ContentTypes.All.Contains(type)) return NotFound();
        var (err, cols) = Extract(type, body);
        if (err is not null) return BadRequest(new { message = err });
        if (cols.Slug is not null && await SlugTaken(type, cols.Slug, id)) return Conflict(new { message = "This URL slug is already in use." });

        var n = await db.ExecuteAsync(@"
UPDATE dbo.ContentItems SET Slug=@Slug, Title=@Title, SortOrder=@SortOrder, IsPublished=@IsPublished, DataJson=@DataJson,
       UpdatedAt=SYSUTCDATETIME(), UpdatedBy=@By
WHERE ContentType=@T AND Id=@Id",
            new { T = type.ToLowerInvariant(), Id = id, cols.Slug, cols.Title, cols.SortOrder, cols.IsPublished, cols.DataJson, By = User.Identity?.Name });
        if (n == 0) return NotFound();
        await audit.LogAsync(User, "update", type, id.ToString());
        await cache.EvictByTagAsync("content", default);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(string type, int id)
    {
        var n = await db.ExecuteAsync("DELETE FROM dbo.ContentItems WHERE ContentType=@T AND Id=@Id", new { T = type.ToLowerInvariant(), Id = id });
        if (n == 0) return NotFound();
        await audit.LogAsync(User, "delete", type, id.ToString());
        await cache.EvictByTagAsync("content", default);
        return NoContent();
    }

    private async Task<bool> SlugTaken(string type, string slug, int? exceptId) =>
        await db.ScalarAsync<int>("SELECT COUNT(*) FROM dbo.ContentItems WHERE ContentType=@T AND Slug=@Slug AND (@Id IS NULL OR Id <> @Id)",
            new { T = type.ToLowerInvariant(), Slug = slug, Id = exceptId }) > 0;

    private sealed record Cols(string? Slug, string Title, int SortOrder, bool IsPublished, string DataJson);

    private static (string? error, Cols cols) Extract(string type, JsonObject body)
    {
        body.Remove("id");
        string? S(string k) => body[k] is JsonValue v && v.TryGetValue<string>(out var s) && !string.IsNullOrWhiteSpace(s) ? s.Trim() : null;
        var title = S("name") ?? S("title") ?? S("question") ?? "";
        if (title.Length == 0) return ("A name / title is required.", null!);
        var slug = S("slug") ?? (type is "categories" ? S("key") : null);
        if (type is "products" or "solutions" or "articles")
        {
            if (slug is null || !SlugRx().IsMatch(slug)) return ("URL slug must contain only lowercase letters, numbers and hyphens.", null!);
        }
        var sort = body["sortOrder"] is JsonValue sv && sv.TryGetValue<int>(out var so) ? so : 0;
        var published = body["published"] is not JsonValue pv || !pv.TryGetValue<bool>(out var pb) || pb;
        return (null, new Cols(slug, title.Length > 300 ? title[..300] : title, sort, published, body.ToJsonString()));
    }

    private static JsonObject ToItem(Dictionary<string, object?> r)
    {
        var o = JsonNode.Parse((string)r["DataJson"]!)!.AsObject();
        o["id"] = (int)r["Id"]!;
        o["published"] = (bool)r["IsPublished"]!;
        o["sortOrder"] = (int)r["SortOrder"]!;
        return o;
    }
}
