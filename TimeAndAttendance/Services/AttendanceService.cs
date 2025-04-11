using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Services
{
    public class AttendanceService(DataContext context) : CommonService<Attendance>(context, context.Attendances)
    {
        private readonly DataContext _context = context;


        /// <summary>
        /// 사용자 ID 로 출퇴근 목록 조회
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<Attendance>> GetItemsByUserId(int userId)
        {
            var all = await GetAllItems();

            return [.. all.Where(e => e.UserId == userId)];
        }
        public async Task<bool> HardPutItem(int id, Attendance modifiedItem)
        {
            var existingUser = await GetItemById(id);
            if (existingUser == null || existingUser.IsDeleted) return false;

            existingUser.Time = modifiedItem.Time;
            existingUser.Status = modifiedItem.Status;

            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
