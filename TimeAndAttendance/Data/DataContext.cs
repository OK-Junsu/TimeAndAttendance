using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Data
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; } = default!;
    }
}
