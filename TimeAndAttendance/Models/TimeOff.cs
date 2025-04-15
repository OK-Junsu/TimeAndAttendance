namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 휴가 신청
    /// </summary>
    public class TimeOff : PostInfo
    {
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


        /// <summary>
        /// 덮어쓰기
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="modifiedItem"></param>
        /// <exception cref="InvalidOperationException"></exception>
        public override void Overwrite<T>(T modifiedItem)
        {
            if (modifiedItem is TimeOff timeOff)
            {
                UserId = timeOff.UserId;
                Date = timeOff.Date;
                Type = timeOff.Type;
            }
            else
                throw new InvalidOperationException(OverwriteErrorMessage);
        }
    }
}
