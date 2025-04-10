namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 출퇴근 기록
    /// </summary>
    public class Attendance : PostInfo
    {
        public int Id { get; set; }
        /// <summary>
        /// 사용자 ID
        /// </summary>
        public int UserId { get; set; }
        /// <summary>
        /// 날짜
        /// </summary>
        public DateOnly Date { get; set; }
        /// <summary>
        /// 상태
        /// </summary>
        public AttendanceStatus Status { get; set; }
    }
}
