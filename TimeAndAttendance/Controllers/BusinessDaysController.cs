using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessDaysController(DataContext context) : ControllerBase
    {
        /// <summary>
        /// GET: api/BusinessDays
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusinessDay>>> GetBusinessDays()
        {
            return await context.BusinessDays.ToListAsync();
        }
        /// <summary>
        /// GET: api/BusinessDays/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<BusinessDay>> GetBusinessDay(int id)
        {
            var businessDay = await context.BusinessDays.FindAsync(id);

            if (businessDay == null)
            {
                return NotFound();
            }

            return businessDay;
        }
        /// <summary>
        /// POST: api/BusinessDays
        /// </summary>
        /// <param name="businessDay"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<BusinessDay>> PostBusinessDay(BusinessDay businessDay)
        {
            context.BusinessDays.Add(businessDay);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetBusinessDay", new { id = businessDay.Id }, businessDay);
        }
        /// <summary>
        /// PUT: api/BusinessDays/5
        /// </summary>
        /// <param name="id"></param>
        /// <param name="businessDay"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBusinessDay(int id, BusinessDay businessDay)
        {
            if (id != businessDay.Id)
            {
                return BadRequest();
            }

            context.Entry(businessDay).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusinessDayExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
            bool BusinessDayExists(int id)
            {
                return context.BusinessDays.Any(e => e.Id == id);
            }
        }
        /// <summary>
        /// DELETE: api/BusinessDays/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<IActionResult> DeleteBusinessDay(int id)
        {
            var businessDay = await context.BusinessDays.FindAsync(id);
            if (businessDay == null)
            {
                return NotFound();
            }

            context.BusinessDays.Remove(businessDay);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
