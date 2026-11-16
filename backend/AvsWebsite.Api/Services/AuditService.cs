using System.Security.Claims;
using AvsWebsite.Api.Data;

namespace AvsWebsite.Api.Services;

public sealed class AuditService(DbHelper db)
{
    public Task LogAsync(ClaimsPrincipal user, string action, string entity, string? entityId = null) =>
        db.ExecuteAsync(
            "INSERT INTO dbo.AuditLog (UserEmail, Action, Entity, EntityId) VALUES (@UserEmail, @Action, @Entity, @EntityId)",
            new { UserEmail = user.FindFirstValue(ClaimTypes.Email) ?? user.FindFirstValue("email") ?? "unknown", Action = action, Entity = entity, EntityId = entityId });
}
