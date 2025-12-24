using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("User ID is required.");
        }

        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.user_id == id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        } catch (Exception ex) {
            Console.WriteLine(ex);
        }

        return Ok(user);
    }

    [HttpPost("delete/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("User ID is required.");
        }

        var userToDelete = await _context.Users.FirstOrDefaultAsync(u => u.user_id == id);

        if (userToDelete == null)
        {
            return NotFound("User not found.");
        }

        _context.Users.Remove(userToDelete);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}