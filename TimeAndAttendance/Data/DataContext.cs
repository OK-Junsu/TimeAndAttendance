using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Data
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Attendance> Attendances { get; set; } = default!;
        public DbSet<TimeOff> TimeOffs { get; set; } = default!;
        public DbSet<BusinessDay> BusinessDays { get; set; } = default!;
    }
}
