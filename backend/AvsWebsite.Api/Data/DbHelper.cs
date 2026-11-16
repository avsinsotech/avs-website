using System.Data;
using Microsoft.Data.SqlClient;

namespace AvsWebsite.Api.Data;

/// <summary>
/// Thin ADO.NET helper (same pattern the AVS team uses in CBS projects – no ORM).
/// All queries are parameterised.
/// </summary>
public sealed class DbHelper(IConfiguration config)
{
    private readonly string _cs = config.GetConnectionString("ConnectionString")
        ?? throw new InvalidOperationException("ConnectionStrings:ConnectionString is not configured.");

    private SqlConnection Open() => new(_cs);

    private static SqlCommand Build(SqlConnection con, string sql, object? args)
    {
        var cmd = new SqlCommand(sql, con) { CommandType = CommandType.Text, CommandTimeout = 30 };
        if (args is null) return cmd;
        foreach (var p in args.GetType().GetProperties())
        {
            var v = p.GetValue(args);
            cmd.Parameters.AddWithValue("@" + p.Name, v ?? DBNull.Value);
        }
        return cmd;
    }

    public async Task<List<Dictionary<string, object?>>> QueryAsync(string sql, object? args = null)
    {
        await using var con = Open();
        await con.OpenAsync();
        await using var cmd = Build(con, sql, args);
        await using var rd = await cmd.ExecuteReaderAsync();
        var rows = new List<Dictionary<string, object?>>();
        while (await rd.ReadAsync())
        {
            var row = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            for (var i = 0; i < rd.FieldCount; i++)
                row[rd.GetName(i)] = rd.IsDBNull(i) ? null : rd.GetValue(i);
            rows.Add(row);
        }
        return rows;
    }

    public async Task<Dictionary<string, object?>?> QuerySingleAsync(string sql, object? args = null)
        => (await QueryAsync(sql, args)).FirstOrDefault();

    public async Task<int> ExecuteAsync(string sql, object? args = null)
    {
        await using var con = Open();
        await con.OpenAsync();
        await using var cmd = Build(con, sql, args);
        return await cmd.ExecuteNonQueryAsync();
    }

    public async Task<T?> ScalarAsync<T>(string sql, object? args = null)
    {
        await using var con = Open();
        await con.OpenAsync();
        await using var cmd = Build(con, sql, args);
        var r = await cmd.ExecuteScalarAsync();
        if (r is null || r is DBNull) return default;
        return (T)Convert.ChangeType(r, Nullable.GetUnderlyingType(typeof(T)) ?? typeof(T));
    }
}
