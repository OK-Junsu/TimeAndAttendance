using Microsoft.EntityFrameworkCore;
using TAMBlazor.Data;
using TAMBlazor.Models;

namespace TAMBlazor.Services
{
    public class UserService(DataContext context) : CommonService<User>(context, context.Users)
    {
        private readonly DataContext _context = context;
        private readonly DbSet<User> _table = context.Users;


        public List<User> GetDefaultUsers() => [
            new()
            {
                Id = 1,
                Name = "1",
                JoiningDate = new(2001, 01, 01),
                CreatedAt = new(2001, 01, 01, 01, 01, 01),
                OriginId = 1
            },
            new()
            {
                Id = 2,
                Name = "2",
                JoiningDate = new(2002, 02, 02),
                CreatedAt = new(2002, 02, 02, 02, 02, 02),
                OriginId = 2
            },
            new()
            {
                Id = 3,
                Name = "3",
                JoiningDate = new(2003, 03, 03),
                CreatedAt = new(2003, 03, 03, 03, 03, 03),
                OriginId = 3
            },
            new()
            {
                Id = 4,
                Name = "4",
                JoiningDate = new(2004, 04, 04),
                CreatedAt = new(2004, 04, 04, 04, 04, 04),
                OriginId = 4
            },
            new()
            {
                Id = 5,
                Name = "5",
                JoiningDate = new(2005, 05, 05),
                CreatedAt = new(2005, 05, 05, 05, 05, 05),
                OriginId = 5
            },
        ];
    }
}
