namespace backend.Models;
using System.ComponentModel.DataAnnotations;

public class Meal
{
    [Key]
    public Guid meal_id { get; set; }
    public string user_id { get; set; }
    public string name { get; set; }
    public float calories { get; set; }
    public float protein { get; set; }
    public float fat { get; set; }
    public float carbs { get; set; }
    public int servings { get; set; }
    public DateTime date { get; set; }

    public override string ToString() {
        return $"meal_id: {meal_id}, user_id: {user_id}, name: {name}, calories: {calories}, protein: {protein}, fat: {fat}, carbs: {carbs}, servings: {servings}, date: {date}";
    }
}