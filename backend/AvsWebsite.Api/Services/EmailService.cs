using System.Net;
using System.Net.Mail;
using System.Text.Encodings.Web;
using AvsWebsite.Api.Models;

namespace AvsWebsite.Api.Services;

public sealed class EmailService(IConfiguration config, ILogger<EmailService> log)
{
    public async Task<bool> SendLeadNotificationAsync(LeadRequest lead, long leadId)
    {
        var s = config.GetSection("Smtp");
        var recipients = s.GetSection("LeadRecipients").Get<string[]>() ?? [];
        if (string.IsNullOrWhiteSpace(s["Host"]) || recipients.Length == 0) return false;

        var h = HtmlEncoder.Default;
        var typeLabel = lead.FormType switch { "demo" => "Demo Request", "product" => "Product Enquiry", _ => "Contact Enquiry" };
        string Row(string k, string? v) => $"<tr><td style='padding:6px 12px;color:#4F6C9E;font-size:13px'>{k}</td><td style='padding:6px 12px;font-size:14px;color:#08152B'><b>{h.Encode(v ?? "-")}</b></td></tr>";
        var body = $@"<div style='font-family:Segoe UI,Arial,sans-serif;max-width:620px'>
  <div style='background:#08152B;color:#fff;padding:18px 22px;border-radius:10px 10px 0 0'>
    <div style='font-size:12px;letter-spacing:2px;color:#4EC0D7'>AVS WEBSITE</div>
    <div style='font-size:20px;font-weight:600'>New {typeLabel} #{leadId}</div>
  </div>
  <table style='width:100%;border:1px solid #D9E1EE;border-top:0;border-collapse:collapse'>
    {Row("Name", lead.Name)}{Row("Organisation", lead.Organisation)}{Row("Designation", lead.Designation)}
    {Row("Mobile", lead.Mobile)}{Row("Email", lead.Email)}{Row("Institution Type", lead.InstitutionType)}
    {Row("Product Interested In", lead.ProductInterest)}{Row("Message", lead.Message)}{Row("Source Page", lead.SourcePage)}
  </table>
  <p style='font-size:12px;color:#7F96BD'>Manage this enquiry in the AVS admin panel → Enquiries &amp; Demos.</p>
</div>";

        try
        {
            using var msg = new MailMessage
            {
                From = new MailAddress(s["From"]!, s["FromName"] ?? "AVS Website"),
                Subject = $"[AVS Website] {typeLabel}: {lead.Organisation} – {lead.Name}",
                Body = body,
                IsBodyHtml = true,
            };
            foreach (var r in recipients) msg.To.Add(r);
            msg.ReplyToList.Add(new MailAddress(lead.Email, lead.Name));

            using var client = new SmtpClient(s["Host"], s.GetValue("Port", 587))
            {
                EnableSsl = s.GetValue("EnableSsl", true),
                Credentials = new NetworkCredential(s["User"], s["Password"]),
            };
            await client.SendMailAsync(msg);
            return true;
        }
        catch (Exception ex)
        {
            // The lead is already saved in the database – email failure must not lose it.
            log.LogError(ex, "Failed to send lead notification for lead {LeadId}", leadId);
            return false;
        }
    }
}
