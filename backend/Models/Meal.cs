namespace backend.Models;

public class Meal
{
    public Guid MealId { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; }
    public float Calories { get; set; }
    public float Protein { get; set; }
    public float Fat { get; set; }
    public float Carbs { get; set; }
    public int Servings { get; set; }
    public DateTime Date { get; set; }
}