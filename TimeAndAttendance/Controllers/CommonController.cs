using Microsoft.AspNetCore.Mvc;
using TimeAndAttendance.Models;
using TimeAndAttendance.Services;

namespace TimeAndAttendance.Controllers
{
    public class CommonController<T>(CommonService<T> service) : ControllerBase where T : PostInfo
    {
        /// <summary>
        /// GET: api/{Table}
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<T>>> GetAllItems()
        {
            var items = await service.GetAllItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/{Table}/NotDeleted
        /// </summary>
        /// <returns></returns>
        [HttpGet("NotDeleted")]
        public async Task<ActionResult<IEnumerable<T>>> GetNotDeletedItems()
        {
            var items = await service.GetNotDeletedItems();

            return Ok(items);
        }
        /// <summary>
        /// GET: api/{Table}/{id}
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<T>> GetItemById(int id)
        {
            var existingItem = await service.GetItemById(id);
            if (existingItem == null) return NotFound();

            return existingItem;
        }
        /// <summary>
        /// POST: api/{Table}
        /// </summary>
        /// <param name="newItem"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<T>> PostItem(T newItem)
        {
            var createdItem = await service.PostItem(newItem);

            return CreatedAtAction(nameof(GetItemById), new { id = createdItem.Id }, createdItem);
        }
        /// <summary>
        /// PUT: api/{Table}/SoftPut/{id}
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("SoftPut/{id}")]
        public async Task<IActionResult> SoftPutItem(int id, T modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.SoftPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/{Table}/HardPut/{id}
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        [HttpPut("HardPut/{id}")]
        public async Task<IActionResult> HardPutItem(int id, T modifiedItem)
        {
            if (id != modifiedItem.Id) return BadRequest();

            var succeeded = await service.HardPutItem(id, modifiedItem);
            if (!succeeded) return NotFound();

            return NoContent();
        }
        /// <summary>
        /// PUT: api/{Table}/SoftDelete/{id}
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
        /// DELETE: api/{Table}/HardDelete/{id}
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
        /// DELETE: api/{Table}/HardDelete
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
