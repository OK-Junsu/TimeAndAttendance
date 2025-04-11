namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 출퇴근 기록
    /// </summary>
    public class Attendance : PostInfo
    {
        /// <summary>
        /// 사용자 ID
        /// </summary>
        public int UserId { get; set; }
        /// <summary>
        /// 시간
        /// </summary>
        public DateTime Time { get; set; }
        /// <summary>
        /// 상태
        /// </summary>
        public AttendanceStatus Status { get; set; }
    }
}
