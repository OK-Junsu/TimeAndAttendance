using System.ComponentModel;

namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 출퇴근 상태
    /// </summary>
    public enum AttendanceStatus
    {
        /// <summary>
        /// 출근
        /// </summary>
        [Description("Check In")]
        CheckIn,
        /// <summary>
        /// 퇴근
        /// </summary>
        [Description("Check Out")]
        CheckOut
    }
}
