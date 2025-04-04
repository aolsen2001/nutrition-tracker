namespace backend.Models;
using System.Collections.Generic;
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
    public string calories { get; set; }
    public string carbohydrate { get; set; }
    public string protein { get; set; }
    public string fat { get; set; }
}