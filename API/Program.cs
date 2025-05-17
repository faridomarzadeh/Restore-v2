using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<StoreContext>(opt =>{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<PaymentsService>();


builder.Services.AddIdentityApiEndpoints<User>(opt => {
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<StoreContext>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseDefaultFiles();
app.UseStaticFiles();
// Configure the HTTP request pipeline.

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(opt => {

    opt.AllowAnyHeader().AllowCredentials().AllowAnyMethod().WithOrigins("https://localhost:3000","https://localhost:5001");

});
app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();

app.MapFallbackToController("Index","Fallback");

await DbInitializer.InitDb(app);

app.Run();
