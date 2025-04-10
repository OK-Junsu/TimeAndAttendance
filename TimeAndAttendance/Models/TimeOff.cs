namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 휴가 신청
    /// </summary>
    public class TimeOff : PostInfo
    {
        public int Id { get; set; }
        /// <summary>
        /// 사용자 ID
        /// </summary>
        public int UserId { get; set; }
        /// <summary>
        /// 희망일
        /// </summary>
        public DateOnly Date { get; set; }
        /// <summary>
        /// 유형
        /// </summary>
        public TimeOffType Type { get; set; }
    }
}
