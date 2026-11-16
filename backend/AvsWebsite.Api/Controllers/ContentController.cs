using System.Text.Json.Nodes;
using AvsWebsite.Api.Data;
using AvsWebsite.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace AvsWebsite.Api.Controllers;

/// <summary>Read-only, cached content endpoints consumed by the Next.js website.</summary>
[ApiController]
[Route("api/content")]
[OutputCache(PolicyName = "content")]
public sealed class ContentController(DbHelper db) : ControllerBase
{
    private async Task<List<JsonObject>> Published(string type)
    {
        var rows = await db.QueryAsync(
            "SELECT DataJson FROM dbo.ContentItems WHERE ContentType = @T AND IsPublished = 1 ORDER BY SortOrder, Title",
            new { T = type });
        return rows.Select(r => JsonNode.Parse((string)r["DataJson"]!)!.AsObject()).ToList();
    }

    [HttpGet("products")] public async Task<IActionResult> Products() => Ok(await Published("products"));
    [HttpGet("solutions")] public async Task<IActionResult> Solutions() => Ok(await Published("solutions"));
    [HttpGet("categories")] public async Task<IActionResult> Categories() => Ok(await Published("categories"));

    [HttpGet("products/{slug}")]
    public async Task<IActionResult> Product(string slug)
    {
        var r = await db.QuerySingleAsync("SELECT DataJson FROM dbo.ContentItems WHERE ContentType='products' AND Slug=@Slug AND IsPublished=1", new { Slug = slug });
        return r is null ? NotFound() : Content((string)r["DataJson"]!, "application/json");
    }

    [HttpGet("articles")]
    public async Task<IActionResult> Articles()
    {
        var items = await db.QueryAsync(
            "SELECT DataJson FROM dbo.ContentItems WHERE ContentType='articles' AND IsPublished=1 ORDER BY JSON_VALUE(DataJson,'$.date') DESC");
        return Ok(items.Select(r =>
        {
            var o = JsonNode.Parse((string)r["DataJson"]!)!.AsObject();
            o.Remove("body");
            return o;
        }));
    }

    [HttpGet("articles/{slug}")]
    public async Task<IActionResult> Article(string slug)
    {
        var r = await db.QuerySingleAsync("SELECT DataJson FROM dbo.ContentItems WHERE ContentType='articles' AND Slug=@Slug AND IsPublished=1", new { Slug = slug });
        return r is null ? NotFound() : Content((string)r["DataJson"]!, "application/json");
    }

    [HttpGet("faqs")]
    public async Task<IActionResult> Faqs()
    {
        var items = await Published("faqs");
        return Ok(items.Select(f => new { q = (string?)f["question"], a = (string?)f["answer"] }));
    }

    [HttpGet("media")]
    public async Task<IActionResult> Media() => Ok(await Published("media"));

    /// <summary>Homepage statistics in the shape the website expects.</summary>
    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        var r = await db.QuerySingleAsync("SELECT ValueJson FROM dbo.SiteSettings WHERE GroupKey = 'homepage'");
        if (r is null) return NotFound();
        var h = JsonNode.Parse((string)r["ValueJson"]!)!.AsObject();
        int N(string k, int d) => h[k] is JsonValue v && v.TryGetValue<int>(out var n) ? n : d;
        return Ok(new object[]
        {
            new { value = N("statClients", 386), suffix = "", label = "Client Institutions" },
            new { value = N("statCustomersLakh", 27), suffix = " Lakh+", label = "End Customers Served" },
            new { value = N("statProfessionals", 51), suffix = "+", label = "Professionals" },
            new { value = N("statProducts", 20), suffix = "+", label = "Products & Modules" },
            new { value = N("established", 2018), suffix = "", label = "Established", noAnimateFormat = true },
        });
    }

    [HttpGet("settings/{group}")]
    public async Task<IActionResult> Settings(string group)
    {
        if (!SettingsGroups.Public.Contains(group)) return NotFound();
        var r = await db.QuerySingleAsync("SELECT ValueJson FROM dbo.SiteSettings WHERE GroupKey = @G", new { G = group.ToLowerInvariant() });
        return r is null ? NotFound() : Content((string)r["ValueJson"]!, "application/json");
    }
}
