using Microsoft.AspNetCore.Mvc;
using TimeAndAttendance.Models;
using TimeAndAttendance.Services;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendancesController(AttendanceService service) : ControllerBase
    {
        /// <summary>
        /// GET: api/Attendances
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAllItems()
        {
            var items = await service.GetAllItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/Attendances/NotDeleted
        /// </summary>
        /// <returns></returns>
        [HttpGet("NotDeleted")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetNotDeletedItems()
        {
            var items = await service.GetNotDeletedItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/Attendances/UserId/5
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("UserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetItemsByUserId(int userId)
        {
            var items = await service.GetItemsByUserId(userId);
            if (items == null) return NotFound();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/Attendances/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetItemById(int id)
        {
            var existingItem = await service.GetItemById(id);
            if (existingItem == null) return NotFound();

            return existingItem;
        }
        /// <summary>
        /// POST: api/Attendances
        /// </summary>
        /// <param name="newItem"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<Attendance>> PostItem(Attendance newItem)
        {
            var createdAttendance = await service.PostItem(newItem);

            return CreatedAtAction(nameof(GetItemById), new { id = createdAttendance.Id }, createdAttendance);
        }
        /// <summary>
        /// PUT: api/Attendances/SoftPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("SoftPut/{id}")]
        public async Task<IActionResult> SoftPutItem(int id, Attendance modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.SoftPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/Attendances/HardPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("HardPut/{id}")]
        public async Task<IActionResult> HardPutItem(int id, Attendance modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.HardPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/Attendances/SoftDelete/5
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
        /// DELETE: api/Attendances/HardDelete/5
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
        /// DELETE: api/Attendances/HardDelete
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
