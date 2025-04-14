using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Services
{
    public class UserService(DataContext context) : CommonService<User>(context, context.Users)
    {
        private readonly DataContext _context = context;
    }
}
