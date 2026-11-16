using System.Text.RegularExpressions;
using AvsWebsite.Api.Data;
using AvsWebsite.Api.Models;
using AvsWebsite.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AvsWebsite.Api.Controllers;

/// <summary>Public endpoint used by every website form (Contact, Request a Demo, Product Enquiry).</summary>
[ApiController]
[Route("api/leads")]
public sealed partial class LeadsController(DbHelper db, EmailService email, RecaptchaService captcha, ILogger<LeadsController> log) : ControllerBase
{
    private const string ThankYou = "Thank you! Our team will contact you shortly.";

    [GeneratedRegex(@"^[6-9]\d{9}$")] private static partial Regex IndianMobile();

    [HttpPost]
    [EnableRateLimiting("leads")]
    public async Task<IActionResult> Create([FromBody] LeadRequest req)
    {
        // Honeypot: silently accept (don't tell bots they were detected).
        if (!string.IsNullOrEmpty(req.Website)) return Ok(new { message = ThankYou });

        if (!req.Consent) return BadRequest(new { message = "Consent is required to submit this form." });

        var mobile = Regex.Replace(req.Mobile, @"[\s-]", "");
        mobile = Regex.Replace(mobile, @"^(\+91|91|0)", "");
        if (!IndianMobile().IsMatch(mobile)) return BadRequest(new { message = "Please enter a valid 10-digit Indian mobile number." });
        if (req.FormType != "contact" && string.IsNullOrWhiteSpace(req.ProductInterest))
            return BadRequest(new { message = "Please select a product." });

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        if (!await captcha.VerifyAsync(req.RecaptchaToken, ip)) return BadRequest(new { message = "Spam check failed. Please try again." });

        var id = await db.ScalarAsync<long>(@"
INSERT INTO dbo.Leads (FormType, Name, Organisation, Designation, Mobile, Email, InstitutionType, ProductInterest, Message,
                       ConsentGiven, ConsentAt, SourcePage, IpAddress, UserAgent)
OUTPUT INSERTED.Id
VALUES (@FormType, @Name, @Organisation, @Designation, @Mobile, @Email, @InstitutionType, @ProductInterest, @Message,
        1, SYSUTCDATETIME(), @SourcePage, @Ip, @Ua)",
            new
            {
                req.FormType, Name = req.Name.Trim(), Organisation = req.Organisation.Trim(), Designation = req.Designation.Trim(),
                Mobile = mobile, Email = req.Email.Trim().ToLowerInvariant(), req.InstitutionType, req.ProductInterest, req.Message,
                req.SourcePage, Ip = ip, Ua = Request.Headers.UserAgent.ToString()[..Math.Min(400, Request.Headers.UserAgent.ToString().Length)],
            });

        req.Mobile = mobile;
        var sent = await email.SendLeadNotificationAsync(req, id);
        if (sent) await db.ExecuteAsync("UPDATE dbo.Leads SET EmailSent = 1 WHERE Id = @Id", new { Id = id });
        log.LogInformation("Lead {LeadId} ({FormType}) received from {Org}", id, req.FormType, req.Organisation);

        return Ok(new { message = ThankYou, id });
    }
}
