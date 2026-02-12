namespace backend.DTOs;

public class FoodDto
{
    public required string Name { get; set; }
    public float Calories { get; set; }
    public float Carbohydrate { get; set; }
    public float Protein { get; set; }
    public float Fat { get; set; }
}