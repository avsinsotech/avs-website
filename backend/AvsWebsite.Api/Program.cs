using System.Text;
using System.Threading.RateLimiting;
using AvsWebsite.Api.Data;
using AvsWebsite.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var cfg = builder.Configuration;

// ---------------- CLI utilities ----------------
//   dotnet AvsWebsite.Api.dll migrate                         -> runs Database/*.sql in order
//   dotnet AvsWebsite.Api.dll create-admin <email> "<name>"   -> prompts for password, creates admin user
if (args.Length > 0 && args[0] is "migrate" or "create-admin")
{
    await Cli.RunAsync(args, cfg);
    return;
}

// ---------------- Services ----------------
builder.Services.AddSingleton<DbHelper>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<RecaptchaService>();
builder.Services.AddScoped<AuditService>();
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtKey = cfg["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
if (jwtKey.Length < 32) throw new InvalidOperationException("Jwt:Key must be at least 32 characters.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, ValidIssuer = cfg["Jwt:Issuer"],
        ValidateAudience = true, ValidAudience = cfg["Jwt:Audience"],
        ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateLifetime = true, ClockSkew = TimeSpan.FromMinutes(1),
    };
});
builder.Services.AddAuthorization();

builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins(cfg.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [])
    .AllowAnyHeader().WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")));

builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    string Ip(HttpContext c) => c.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    o.AddPolicy("leads", c => RateLimitPartition.GetFixedWindowLimiter(Ip(c), _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(10) }));
    o.AddPolicy("login", c => RateLimitPartition.GetFixedWindowLimiter(Ip(c), _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(5) }));
    o.OnRejected = async (ctx, ct) =>
    {
        ctx.HttpContext.Response.ContentType = "application/json";
        await ctx.HttpContext.Response.WriteAsync("{\"message\":\"Too many requests. Please try again later or call +91 9029088876.\"}", ct);
    };
});

builder.Services.AddOutputCache(o => o.AddPolicy("content", p => p.Expire(TimeSpan.FromMinutes(5)).Tag("content")));
builder.Services.Configure<ForwardedHeadersOptions>(o =>
{
    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    o.KnownNetworks.Clear(); o.KnownProxies.Clear();
});

var app = builder.Build();

// ---------------- Pipeline ----------------
app.UseForwardedHeaders();
if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }
else { app.UseHsts(); }
app.UseHttpsRedirection();

app.Use(async (ctx, next) =>
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";
    ctx.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    await next();
});

app.UseStaticFiles(); // serves wwwroot/uploads
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseOutputCache();

app.MapGet("/api/health", async (DbHelper db) =>
{
    try { await db.ScalarAsync<int>("SELECT 1"); return Results.Ok(new { status = "ok", db = "ok" }); }
    catch { return Results.Json(new { status = "degraded", db = "unreachable" }, statusCode: 503); }
});
app.MapControllers();

app.Run();

// ---------------- CLI implementation ----------------
static class Cli
{
    public static async Task RunAsync(string[] args, IConfiguration cfg)
    {
        var cs = cfg.GetConnectionString("ConnectionString")!;
        if (args[0] == "migrate")
        {
            var dir = Path.Combine(AppContext.BaseDirectory, "Database");
            foreach (var file in Directory.GetFiles(dir, "*.sql").OrderBy(f => f))
            {
                Console.WriteLine($"Running {Path.GetFileName(file)} ...");
                var sql = await File.ReadAllTextAsync(file);
                await using var con = new SqlConnection(cs);
                await con.OpenAsync();
                foreach (var batch in System.Text.RegularExpressions.Regex.Split(sql, @"^\s*GO\s*$", System.Text.RegularExpressions.RegexOptions.Multiline | System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                {
                    if (string.IsNullOrWhiteSpace(batch)) continue;
                    await using var cmd = new SqlCommand(batch, con) { CommandTimeout = 120 };
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            Console.WriteLine("Database ready.");
            return;
        }

        if (args.Length < 3) { Console.WriteLine("Usage: create-admin <email> \"<name>\""); return; }
        Console.Write("Password (min 10 chars): ");
        var pw = ReadPassword();
        if (pw.Length < 10) { Console.WriteLine("Password too short."); return; }
        var db = new DbHelper(cfg);
        await db.ExecuteAsync(@"
MERGE dbo.AdminUsers AS t USING (SELECT @Email AS Email) s ON t.Email = s.Email
WHEN MATCHED THEN UPDATE SET Name=@Name, PasswordHash=@Hash, IsActive=1, FailedAttempts=0, LockoutUntil=NULL
WHEN NOT MATCHED THEN INSERT (Name, Email, PasswordHash, Role) VALUES (@Name, @Email, @Hash, 'Admin');",
            new { Email = args[1].Trim().ToLowerInvariant(), Name = args[2], Hash = PasswordHasher.Hash(pw) });
        Console.WriteLine($"Admin user {args[1]} is ready.");
    }

    private static string ReadPassword()
    {
        if (Console.IsInputRedirected) return Console.ReadLine() ?? "";
        var sb = new StringBuilder();
        ConsoleKeyInfo k;
        while ((k = Console.ReadKey(true)).Key != ConsoleKey.Enter)
        {
            if (k.Key == ConsoleKey.Backspace && sb.Length > 0) sb.Length--;
            else if (!char.IsControl(k.KeyChar)) sb.Append(k.KeyChar);
        }
        Console.WriteLine();
        return sb.ToString();
    }
}
