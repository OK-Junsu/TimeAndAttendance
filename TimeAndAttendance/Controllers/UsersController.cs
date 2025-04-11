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
        public async Task<ActionResult<IEnumerable<User>>> GetAllItems()
        {
            var items = await service.GetAllItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/Users/NotDeleted
        /// </summary>
        /// <returns></returns>
        [HttpGet("NotDeleted")]
        public async Task<ActionResult<IEnumerable<User>>> GetNotDeletedItems()
        {
            var items = await service.GetNotDeletedItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/Users/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetItemById(int id)
        {
            var existingItem = await service.GetItemById(id);
            if (existingItem == null) return NotFound();

            return existingItem;
        }
        /// <summary>
        /// POST: api/Users
        /// </summary>
        /// <param name="newItem"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<User>> PostItem(User newItem)
        {
            var createdItem = await service.PostItem(newItem);

            return CreatedAtAction(nameof(GetItemById), new { id = createdItem.Id }, createdItem);
        }
        /// <summary>
        /// PUT: api/Users/SoftPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("SoftPut/{id}")]
        public async Task<IActionResult> SoftPutItem(int id, User modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.SoftPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/Users/HardPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("HardPut/{id}")]
        public async Task<IActionResult> HardPutItem(int id, User modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.HardPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/Users/SoftDelete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("SoftDelete/{id}")]
        public async Task<IActionResult> SoftDeleteItem(int id)
        {
            var succeeded = await service.SoftDeleteItem(id);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// DELETE: api/Users/HardDelete/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("HardDelete/{id}")]
        public async Task<IActionResult> HardDeleteItem(int id)
        {
            var succeeded = await service.HardDeleteItem(id);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// DELETE: api/Users/HardDelete
        /// </summary>
        /// <returns></returns>
        [HttpDelete("HardDelete")]
        public async Task<IActionResult> HardDeleteAllItems()
        {
            var succeeded = await service.HardDeleteAllItems();
            if (!succeeded) return NotFound();

            return NoContent();
        }
    }
}
