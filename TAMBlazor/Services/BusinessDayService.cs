using Microsoft.EntityFrameworkCore;
using TAMBlazor.Data;
using TAMBlazor.Models;

namespace TAMBlazor.Services
{
    public class BusinessDayService(DataContext context) : CommonService<BusinessDay>(context, context.BusinessDays)
    {
        private readonly DataContext _context = context;
        private readonly DbSet<BusinessDay> _table = context.BusinessDays;


        public async Task ReArrangeWeekends(int year)
        {
            var existingItems = _table.Any()
                ? _table.Where(e => e.Date.Year == year &&
                                    e.Type == BusinessDayType.Weekend &&
                                    !e.DeletedAt.HasValue).ToList() : [];
            var newItems = GetWeekends(year);

            // 기존 목록과 새로운 목록의 개수가 다르므로
            // SoftPut 하지 않고 전체 SoftDelete 후 새 목록 추가
            if (existingItems.Count != newItems.Count)
            {
                // 기존 목록 삭제
                foreach (var item in existingItems)
                {
                    await SoftDeleteItem(item.Id);
                }

                // 새로운 목록 추가
                foreach (var item in newItems)
                {
                    await PostItem(item);
                }
            }
        }
        public List<BusinessDay> GetWeekends(int year)
        {
            return [.. Enumerable.Range(1, (DateTime.IsLeapYear(year) ? 366 : 365))
                .Select(day => new DateTime(year, 1, 1).AddDays(day - 1))
                .Where(date => date.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday)
                .Select(date =>
                {
                    return new BusinessDay
                    {
                        Date = new DateOnly(date.Year, date.Month, date.Day),
                        Type = BusinessDayType.Weekend,
                        Description = BusinessDayType.Weekend.ToString()
                    };
                })];
        }
    }
}
