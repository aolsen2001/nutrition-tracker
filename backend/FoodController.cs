using backend.DTOs;
using Microsoft.AspNetCore.Mvc;

[Route("api/foods")]
[ApiController]
public class FoodController : ControllerBase
{
    private readonly FatSecretService _fatSecretService;

    public FoodController(FatSecretService fatSecretService)
    {
        _fatSecretService = fatSecretService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchFood([FromQuery] string query, [FromQuery] int pageNumber)
    {
        var result = await _fatSecretService.SearchFoodAsync(query, pageNumber);

        var foods = result.foods_search?.results?.food;

        if (foods == null)
        {
            return Ok(new List<FoodDto>());
        }

        var response = foods.Select(f =>
        {
            var firstServing = f.servings?.serving?.FirstOrDefault();

            return new FoodDto
            {
                Name = f.food_name,
                Calories = firstServing?.calories ?? 0,
                Carbohydrate = firstServing?.carbohydrate ?? 0,
                Protein = firstServing?.protein ?? 0,
                Fat = firstServing?.fat ?? 0
            };
        });

        return Ok(response);
    }
}
