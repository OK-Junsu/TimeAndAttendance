using TimeAndAttendance.Services;

namespace TimeAndAttendance.Data
{
    public class DatabaseInitializer(IServiceProvider serviceProvider) : IHostedService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;


        /// <summary>
        /// 데이터베이스가 비어 있을 경우, 각 서비스로부터 데이터를 가져와서 초기화
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();

            await BusinessDays(context);
        }
        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;


        private static async Task BusinessDays(DataContext context)
        {
            var service = new BusinessDayService(context);

            // This Year Weekends
            await service.ReArrangeWeekends(DateTime.Now.Year);

            // Next Year Weekends
            await service.ReArrangeWeekends(DateTime.Now.Year + 1);
        }
    }
}
