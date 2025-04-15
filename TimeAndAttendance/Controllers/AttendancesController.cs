using Microsoft.AspNetCore.Mvc;
using TimeAndAttendance.Models;
using TimeAndAttendance.Services;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendancesController(AttendanceService service) : CommonController<Attendance>(service)
    {
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
    }
}
