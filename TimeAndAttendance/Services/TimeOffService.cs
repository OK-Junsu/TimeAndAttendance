using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Services
{
    public class TimeOffService(DataContext context) : CommonService<TimeOff>(context, context.TimeOffs)
    {
        private readonly DataContext _context = context;
    }
}
