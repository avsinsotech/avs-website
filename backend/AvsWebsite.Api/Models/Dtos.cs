using System.ComponentModel.DataAnnotations;

namespace AvsWebsite.Api.Models;

public sealed class LeadRequest
{
    [Required, RegularExpression("^(contact|demo|product)$")] public string FormType { get; set; } = "contact";
    [Required, StringLength(100, MinimumLength = 2)] public string Name { get; set; } = "";
    [Required, StringLength(150, MinimumLength = 2)] public string Organisation { get; set; } = "";
    [Required, StringLength(100, MinimumLength = 2)] public string Designation { get; set; } = "";
    [Required, StringLength(15)] public string Mobile { get; set; } = "";
    [Required, EmailAddress, StringLength(150)] public string Email { get; set; } = "";
    [Required, StringLength(100)] public string InstitutionType { get; set; } = "";
    [StringLength(200)] public string? ProductInterest { get; set; }
    [StringLength(2000)] public string? Message { get; set; }
    public bool Consent { get; set; }
    /// <summary>Honeypot – must be empty.</summary>
    public string? Website { get; set; }
    [StringLength(300)] public string? SourcePage { get; set; }
    public string? RecaptchaToken { get; set; }
}

public sealed class LeadPatch
{
    [RegularExpression("^(New|Contacted|Demo Scheduled|Qualified|Closed)$")] public string? Status { get; set; }
    [StringLength(4000)] public string? Notes { get; set; }
}

public sealed class LoginRequest
{
    [Required, EmailAddress] public string Email { get; set; } = "";
    [Required] public string Password { get; set; } = "";
}

public static class ContentTypes
{
    public static readonly HashSet<string> All = new(StringComparer.OrdinalIgnoreCase)
        { "products", "categories", "solutions", "articles", "faqs", "media" };
}

public static class SettingsGroups
{
    public static readonly HashSet<string> All = new(StringComparer.OrdinalIgnoreCase) { "company", "homepage", "seo" };
    /// <summary>Groups that may be read anonymously by the public website.</summary>
    public static readonly HashSet<string> Public = new(StringComparer.OrdinalIgnoreCase) { "company", "homepage" };
}
