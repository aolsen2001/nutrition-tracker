using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
        return Ok(result);
    }
}
