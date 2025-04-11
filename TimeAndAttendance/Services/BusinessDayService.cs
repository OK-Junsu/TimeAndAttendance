using TimeAndAttendance.Data;
using TimeAndAttendance.Models;

namespace TimeAndAttendance.Services
{
    public class BusinessDayService(DataContext context) : CommonService<BusinessDay>(context, context.BusinessDays)
    {
        private readonly DataContext _context = context;


        private static List<BusinessDay> GetBusinessDays(int year)
        {
            var weekends = new List<BusinessDay>();

            foreach (var day in Enumerable.Range(1, (DateTime.IsLeapYear(year) ? 366 : 365)))
            {
                var date = new DateTime(year, 1, 1).AddDays(day - 1);

                if (date.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday)
                {
                    weekends.Add(new BusinessDay
                    {
                        Id = day,
                        Date = new DateOnly(date.Year, date.Month, date.Day),
                        Type = BusinessDayType.Weekend,
                        Description = BusinessDayType.Weekend.ToString()
                    });
                }
            }

            return [];
        }
    }
}
