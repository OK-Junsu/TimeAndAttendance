using Microsoft.AspNetCore.Mvc;
using TimeAndAttendance.Models;
using TimeAndAttendance.Services;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessDaysController(BusinessDayService service) : CommonController<BusinessDay>(service)
    {

    }
}
