using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using TimeAndAttendance.Data;
using TimeAndAttendance.Services;

var builder = WebApplication.CreateBuilder(args);

// 컨트롤러 및 JSON 직렬화 설정
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Enum 값을 문자열로 직렬화/역직렬화하기 위한 설정
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// DbContext 등록
// SQLite 데이터베이스를 사용하며, 연결 문자열은 appsettings.json에서 가져옵니다.
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// DatabaseInitializer 등록
// 애플리케이션 시작 시 초기 데이터를 데이터베이스에 삽입하는 Hosted Service를 등록합니다.
builder.Services.AddHostedService<DatabaseInitializer>();

// 애플리케이션에서 사용할 서비스 등록
// 각 서비스는 DI(의존성 주입)를 통해 컨트롤러에서 사용됩니다.
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AttendanceService>();
builder.Services.AddScoped<BusinessDayService>();

var app = builder.Build();

// 기본 파일 설정
// 요청이 루트 경로로 들어올 경우 "Home.html"을 기본 파일로 제공합니다.
app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = ["Home.html"]
});

// 정적 파일 제공 설정
// 정적 파일에 대해 캐싱을 비활성화하여 항상 최신 파일을 제공하도록 설정합니다.
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.CacheControl = "no-cache, no-store, must-revalidate";
        ctx.Context.Response.Headers.Pragma = "no-cache";
        ctx.Context.Response.Headers.Expires = "0";
    }
});

// HTTPS 리디렉션 활성화
// HTTP 요청을 HTTPS로 리디렉션합니다.
app.UseHttpsRedirection();

// 권한 부여 미들웨어 추가
// 현재는 인증/권한 부여 로직이 없으므로 빈 상태로 유지됩니다.
app.UseAuthorization();

// 컨트롤러 라우팅 매핑
// 컨트롤러의 엔드포인트를 애플리케이션에 매핑합니다.
app.MapControllers();

// 애플리케이션 실행
// 웹 서버를 시작하고 요청을 처리합니다.
app.Run();
