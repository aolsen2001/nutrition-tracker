using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Threading.Tasks;

[Route("api/meal")]
[ApiController]
public class MealController : ControllerBase
{
    private readonly AppDbContext _context;

    public MealController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("meals")]
    public async Task<IActionResult> GetMeals()
    {
        var result = await _context.Meals.Select(x => new Meal
        {
            MealId = x.MealId,
            UserId = x.UserId,
            Name = x.Name,
            Calories = x.Calories,
            Protein = x.Protein,
            Fat = x.Fat,
            Carbs = x.Carbs,
            Servings = x.Servings,
            Date = x.Date
        }).ToListAsync();
        return Ok(result);
    }

    [HttpPost("create-meal")]
    public async Task<IActionResult> CreateMeal([FromQuery] Meal meal)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Meals.Add(meal);
        await _context.SaveChangesAsync();
        return Ok(meal);
    }
}