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


        /// <summary>
        /// 덮어쓰기
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="modifiedItem"></param>
        /// <exception cref="InvalidOperationException"></exception>
        public override void Overwrite<T>(T modifiedItem)
        {
            if (modifiedItem is Attendance item)
            {
                UserId = item.UserId;
                Time = item.Time;
                Status = item.Status;
            }
            else
                throw new InvalidOperationException(OverwriteErrorMessage);
        }
    }
}
