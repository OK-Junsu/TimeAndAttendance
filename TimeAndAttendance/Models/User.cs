namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 사용자 정보
    /// </summary>
    public class User : PostInfo
    {
        public int Id { get; set; }
        /// <summary>
        /// 이름
        /// </summary>
        public string Name { get; set; } = default!;
        /// <summary>
        /// 입사일
        /// </summary>
        public DateOnly JoiningDate { get; set; }
        /// <summary>
        /// 퇴사일
        /// </summary>
        public DateOnly? ResignationDate { get; set; }
    }
}
