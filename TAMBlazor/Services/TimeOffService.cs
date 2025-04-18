using Microsoft.EntityFrameworkCore;
using TAMBlazor.Data;
using TAMBlazor.Models;

namespace TAMBlazor.Services
{
    public class TimeOffService(DataContext context) : CommonService<TimeOff>(context, context.TimeOffs)
    {
        private readonly DataContext _context = context;
        private readonly DbSet<TimeOff> _table = context.TimeOffs;
    }
}
