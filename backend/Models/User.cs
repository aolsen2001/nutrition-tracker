namespace backend.Models;

public class User
{
    public Guid UserId { get; set; }
    public string Email { get; set; }
    public int CalorieGoal { get; set; }
    public int ProteinGoal { get; set; }
    public int CarbGoal { get; set; }
    public int FatGoal { get; set; }
}