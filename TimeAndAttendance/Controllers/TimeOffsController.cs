using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeOffsController : ControllerBase
    {
        private readonly DataContext _context;

        public TimeOffsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/TimeOffs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimeOff>>> GetTimeOffs()
        {
            return await _context.TimeOffs.ToListAsync();
        }

        // GET: api/TimeOffs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TimeOff>> GetTimeOff(int id)
        {
            var timeOff = await _context.TimeOffs.FindAsync(id);

            if (timeOff == null)
            {
                return NotFound();
            }

            return timeOff;
        }

        // PUT: api/TimeOffs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTimeOff(int id, TimeOff timeOff)
        {
            if (id != timeOff.Id)
            {
                return BadRequest();
            }

            _context.Entry(timeOff).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeOffExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TimeOffs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TimeOff>> PostTimeOff(TimeOff timeOff)
        {
            _context.TimeOffs.Add(timeOff);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTimeOff", new { id = timeOff.Id }, timeOff);
        }

        // DELETE: api/TimeOffs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTimeOff(int id)
        {
            var timeOff = await _context.TimeOffs.FindAsync(id);
            if (timeOff == null)
            {
                return NotFound();
            }

            _context.TimeOffs.Remove(timeOff);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TimeOffExists(int id)
        {
            return _context.TimeOffs.Any(e => e.Id == id);
        }
    }
}
