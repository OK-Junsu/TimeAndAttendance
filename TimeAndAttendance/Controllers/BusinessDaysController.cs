using Microsoft.AspNetCore.Mvc;
using TimeAndAttendance.Models;
using TimeAndAttendance.Services;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessDaysController(BusinessDayService service) : ControllerBase
    {
        /// <summary>
        /// GET: api/BusinessDays
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusinessDay>>> GetAllItems()
        {
            var items = await service.GetAllItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/BusinessDays/NotDeleted
        /// </summary>
        /// <returns></returns>
        [HttpGet("NotDeleted")]
        public async Task<ActionResult<IEnumerable<BusinessDay>>> GetNotDeletedItems()
        {
            var items = await service.GetNotDeletedItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/BusinessDays/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<BusinessDay>> GetItemById(int id)
        {
            var existingItem = await service.GetItemById(id);
            if (existingItem == null) return NotFound();

            return existingItem;
        }
        /// <summary>
        /// POST: api/BusinessDays
        /// </summary>
        /// <param name="newItem"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<BusinessDay>> PostItem(BusinessDay newItem)
        {
            var createdItem = await service.PostItem(newItem);

            return CreatedAtAction(nameof(GetItemById), new { id = createdItem.Id }, createdItem);
        }
        /// <summary>
        /// PUT: api/BusinessDays/SoftPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("SoftPut/{id}")]
        public async Task<IActionResult> SoftPutItem(int id, BusinessDay modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.SoftPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/BusinessDays/HardPut/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("HardPut/{id}")]
        public async Task<IActionResult> HardPutItem(int id, BusinessDay modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.HardPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/BusinessDays/SoftDelete/5
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
        /// DELETE: api/BusinessDays/HardDelete/5
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
        /// DELETE: api/BusinessDays/HardDelete
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
