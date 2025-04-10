using Microsoft.AspNetCore.Mvc;
using TimeAndAttendance.Models;
using TimeAndAttendance.Services;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(UserService service) : ControllerBase
    {
        /// <summary>
        /// GET: api/Users
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await service.GetAllUsersAsync();

            return Ok(users);
        }
        /// <summary>
        /// GET: api/Users/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var existingUser = await service.GetUserByIdAsync(id);
            if (existingUser == null) return NotFound();

            return existingUser;
        }
        /// <summary>
        /// POST: api/Users
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            var createdUser = await service.CreateUserAsync(user);

            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }
        /// <summary>
        /// PUT: api/Users/SoftPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut("SoftPut/{id}")]
        public async Task<IActionResult> SoftPutUser(int id, User user)
        {
            if (id != user.Id) return BadRequest();

            var succeeded = await service.SoftPutUserAsync(id, user);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/Users/HardPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut("HardPut/{id}")]
        public async Task<IActionResult> HardPutUser(int id, User user)
        {
            if (id != user.Id) return BadRequest();

            var succeeded = await service.HardPutUserAsync(id, user);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/Users/SoftDelete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("SoftDelete/{id}")]
        public async Task<IActionResult> SoftDeleteUser(int id)
        {
            var succeeded = await service.SoftDeleteUserAsync(id);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// DELETE: api/Users/HardDelete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("HardDelete/{id}")]
        public async Task<IActionResult> HardDeleteUser(int id)
        {
            var succeeded = await service.HardDeleteUserAsync(id);
            if (!succeeded) return NotFound();

            return NoContent();
        }
    }
}
