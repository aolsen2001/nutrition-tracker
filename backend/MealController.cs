using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Threading.Tasks;

[Route("api/meals")]
[ApiController]
public class MealController : ControllerBase
{
    private readonly AppDbContext _context;

    public MealController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMeals([FromQuery] string userId)
    {
        IQueryable<Meal> query = _context.Meals;

        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(meal => meal.user_id == userId);    
        }

        var result = await query.Select(x => new Meal
        {
            meal_id = x.meal_id,
            user_id = x.user_id,
            name = x.name,
            calories = x.calories,
            protein = x.protein,
            fat = x.fat,
            carbs = x.carbs,
            servings = x.servings,
            date = x.date
        }).ToListAsync();

        return Ok(result);
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteMeal(Guid mealId)
    {
        if (mealId == Guid.Empty)
        {
            return BadRequest("mealId cannot be empty");
        }

        var mealToDelete = await _context.Meals.FirstOrDefaultAsync(meal => meal.meal_id == mealId);

        if (mealToDelete == null)
        {
            return NotFound("Meal not found");
        }

        _context.Meals.Remove(mealToDelete);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateMeal([FromBody] Meal meal)
    {
        Console.WriteLine("In CreateMeal");

        Console.WriteLine(meal.ToString());

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Console.WriteLine("ModelState valid");

        try {
            _context.Meals.Add(meal);
            await _context.SaveChangesAsync();
        } catch (Exception ex) {
            Console.WriteLine(ex);
        }

        return Ok(meal);
    }
}