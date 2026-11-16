using System.Text.Json;

namespace AvsWebsite.Api.Services;

/// <summary>Optional Google reCAPTCHA v3 verification. Disabled when no secret key is configured.</summary>
public sealed class RecaptchaService(IConfiguration config, IHttpClientFactory http)
{
    public bool Enabled => !string.IsNullOrWhiteSpace(config["Recaptcha:SecretKey"]);

    public async Task<bool> VerifyAsync(string? token, string? ip)
    {
        if (!Enabled) return true;
        if (string.IsNullOrWhiteSpace(token)) return false;
        var client = http.CreateClient();
        var res = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["secret"] = config["Recaptcha:SecretKey"]!, ["response"] = token, ["remoteip"] = ip ?? "",
        }));
        using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        var ok = doc.RootElement.TryGetProperty("success", out var s) && s.GetBoolean();
        var score = doc.RootElement.TryGetProperty("score", out var sc) ? sc.GetDouble() : 1.0;
        return ok && score >= config.GetValue("Recaptcha:MinScore", 0.5);
    }
}
