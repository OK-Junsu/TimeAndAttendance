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
    }
}
