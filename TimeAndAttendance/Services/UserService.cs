using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Services
{
    public class UserService(DataContext context) : CommonService<User>(context, context.Users)
    {
        private readonly DataContext _context = context;


        /// <summary>
        /// 사용자 하드 수정
        /// </summary>
        /// <param name="id"></param>
        /// <param name="modifiedItem"></param>
        /// <returns></returns>
        public async Task<bool> HardPutItem(int id, User modifiedItem)
        {
            var existingUser = await GetItemById(id);
            if (existingUser == null || existingUser.IsDeleted) return false;

            existingUser.Name = modifiedItem.Name;
            existingUser.JoiningDate = modifiedItem.JoiningDate;
            existingUser.ResignationDate = modifiedItem.ResignationDate;

            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
