namespace backend.Models
public class ApiFoodSearchResponse
{
    public FoodsSearch foods_search { get; set; }
}

public class FoodsSearch
{
    public int max_results { get; set; }
    public int total_results { get; set; }
    public int page_number { get; set; }
    public List<Food> results { get; set; }
}

public class Food
{
    public string food_name { get; set; }
    public Nutrients nutrients { get; set; }
}

public class Nutrients
{
    public string calories { get; set; }
    public string carbohydrate { get; set; }
    public string protein { get; set; }
    public string fat { get; set; }
}

