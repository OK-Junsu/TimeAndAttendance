using System.ComponentModel;

namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 휴가 종류
    /// </summary>
    public enum TimeOffType
    {
        /// <summary>
        /// 연차
        /// </summary>
        [Description("Annual Leave")]
        AnnualLeave,
        /// <summary>
        /// 반차
        /// </summary>
        [Description("Half Day Off")]
        HalfDayOff,
        /// <summary>
        /// 기타 유급 휴가
        /// </summary>
        [Description("Other Paid Time Off")]
        OtherPaidTimeOff,
        /// <summary>
        /// 무급 휴가
        /// </summary>
        [Description("Non-Paid Time Off")]
        NonPaidTimeOff
    }
}
