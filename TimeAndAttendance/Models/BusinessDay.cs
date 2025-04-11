namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 업무일 정보
    /// </summary>
    public class BusinessDay : PostInfo
    {
        public DateOnly Date { get; set; }
        /// <summary>
        /// 유형
        /// </summary>
        public BusinessDayType Type { get; set; }
        /// <summary>
        /// 설명
        /// </summary>
        public string? Description { get; set; }
    }
}
