using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class FatSecretService
{
    private readonly HttpClient _httpClient;
    private readonly string _clientId;
    private readonly string _clientSecret;

    public FatSecretService(HttpClient httpClient, string clientId, string clientSecret)
    {
        _httpClient = httpClient;
        _clientId = clientId;
        _clientSecret = clientSecret;
    }

    public async Task<string> GetAccessTokenAsync()
    {
        var byteArray = Encoding.ASCII.GetBytes($"{_clientId}:{_clientSecret}");
        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

        var values = new Dictionary<string, string>
        {
            { "scope", "basic" },
            { "grant_type", "client_credentials" }
        };

        var content = new FormUrlEncodedContent(values);
        var response = await _httpClient.PostAsync("https://oauth.fatsecret.com/connect/token", content);

        var responseString = await response.Content.ReadAsStringAsync();

        var responseObject = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(responseString);

        return responseObject["access_token"];
    }

    public async Task<IEnumerable<string>> SearchFoodAsync(string query)
    {
        var token = await GetAccessTokenAsync();

        var url = $"https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression={Uri.EscapeDataString(query)}";

        var requestMessage = new HttpRequestMessage(HttpMethod.Get, url);
        requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.SendAsync(requestMessage);
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error searching food: {response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        return new List<string> { responseContent };
    }
}
