using DatingWebsite.Components;
using DatingWebsite.Data;
using DatingWebsite.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Добавляем сервисы
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpContextAccessor();

// База данных
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Server=(localdb)\\mssqllocaldb;Database=DatingWebsiteDb;Trusted_Connection=True;MultipleActiveResultSets=true"));

var app = builder.Build();

// Конфигурация пайплайна
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

// Создание БД
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
    Console.WriteLine("База данных создана");
}
catch (Exception ex)
{
    Console.WriteLine($"Ошибка БД: {ex.Message}");
}

app.Run();