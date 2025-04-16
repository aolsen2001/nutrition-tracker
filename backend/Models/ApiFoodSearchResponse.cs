namespace backend.Models;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public class ApiTokenResponse
{
    public string access_token { get; set; }
    public string token_type { get; set; }
    public int expires_in { get; set; }
    public string scope { get; set; }
}

public class ApiFoodSearchResponse
{
    public FoodsSearch foods_search { get; set; }
}

public class FoodsSearch
{
    public string max_results { get; set; }
    public string total_results { get; set; }
    public string page_number { get; set; }

    public FoodResults results { get; set; }
}

public class FoodResults
{
    public List<Food> food { get; set; }
}

public class Food
{
    public string food_id { get; set; }
    public string food_name { get; set; }
    public Servings servings { get; set; }
}

public class Servings
{
    public List<Serving> serving { get; set; }
}

public class Serving
{
    [JsonConverter(typeof(JsonStringToFloatConverter))]
    public float calories { get; set; }

    [JsonConverter(typeof(JsonStringToFloatConverter))]
    public float carbohydrate { get; set; }

    [JsonConverter(typeof(JsonStringToFloatConverter))]
    public float protein { get; set; }

    [JsonConverter(typeof(JsonStringToFloatConverter))]
    public float fat { get; set; }
}

// parses incoming string values for calories, carbs, protein and fat to int values
public class JsonStringToFloatConverter : JsonConverter<float>
{
    public override float Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            if (float.TryParse(reader.GetString(), out var value))
            {
                return value;
            }
        }
        return 0;
    }

    public override void Write(Utf8JsonWriter writer, float value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString());
    }
}