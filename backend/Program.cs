using DotNetEnv;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;

Env.Load("../.env");

var clientId = Environment.GetEnvironmentVariable("CLIENT_ID");
var clientSecret = Environment.GetEnvironmentVariable("CLIENT_SECRET");

if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
{
    Console.WriteLine("Client ID or Client Secret is not set correctly.");
}
else
{
    Console.WriteLine($"Client ID: {clientId}");
    Console.WriteLine($"Client Secret: {clientSecret}");
}

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<FatSecretService>();

builder.Services.AddSingleton<FatSecretService>(serviceProvider =>
{
    var client = serviceProvider.GetRequiredService<HttpClient>();

    return new FatSecretService(client, clientId, clientSecret);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();