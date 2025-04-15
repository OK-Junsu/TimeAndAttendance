using Microsoft.AspNetCore.Mvc;
using TimeAndAttendance.Models;
using TimeAndAttendance.Services;

namespace TimeAndAttendance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(UserService service) : CommonController<User>(service)
    {

    }
}
