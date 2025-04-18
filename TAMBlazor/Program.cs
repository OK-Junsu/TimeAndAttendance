using Microsoft.EntityFrameworkCore;
using TAMBlazor.Data;
using TAMBlazor.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite("Data Source=BlazorAppData.db"));
builder.Services.AddHostedService<DatabaseInitializer>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AttendanceService>();
builder.Services.AddScoped<BusinessDayService>();
builder.Services.AddScoped<TimeOffService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
