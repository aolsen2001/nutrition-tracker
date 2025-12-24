namespace backend.Models;
using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public string user_id { get; set; }
    public string email { get; set; }
    public int calorie_goal { get; set; }
    public int protein_goal { get; set; }
    public int carb_goal { get; set; }
    public int fat_goal { get; set; }
}