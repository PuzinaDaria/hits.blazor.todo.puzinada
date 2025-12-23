using DatingWebsite.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace DatingWebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                    return BadRequest(new { error = "Email обязателен" });

                if (string.IsNullOrWhiteSpace(request.Password))
                    return BadRequest(new { error = "Пароль обязателен" });

                var user = await _authService.LoginAsync(request.Email, request.Password);

                if (user == null)
                {
                    return Unauthorized(new { error = "Неверный email или пароль" });
                }

                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.Age,
                        user.Description,
                        user.LookingFor,
                        user.PreferredAgeRange,
                        user.Interests
                    },
                    message = "Вход выполнен успешно"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Ошибка входа: {ex.Message}" });
            }
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Валидация на сервере
                if (string.IsNullOrWhiteSpace(request.Email))
                    return BadRequest(new { error = "Email обязателен" });

                if (string.IsNullOrWhiteSpace(request.Password))
                    return BadRequest(new { error = "Пароль обязателен" });

                // Убрали проверку длины пароля
                // if (request.Password.Length < 6)
                //     return BadRequest(new { error = "Пароль должен содержать не менее 6 символов" });

                if (request.Age < 18 || request.Age > 100)
                    return BadRequest(new { error = "Возраст должен быть от 18 до 100 лет" });

                var user = await _authService.RegisterAsync(
                    request.Email,
                    request.Password,
                    request.FirstName,
                    request.LastName,
                    request.Age,
                    request.Description ?? "",
                    request.LookingFor,
                    request.PreferredAgeRange,
                    request.Interests ?? ""
                );

                if (user == null)
                {
                    return BadRequest(new { error = "Пользователь с таким email уже существует" });
                }

                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.Age
                    },
                    message = "Регистрация успешна"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Ошибка регистрации: {ex.Message}" });
            }
        }

        public class RegisterRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string FirstName { get; set; } = string.Empty;
            public string LastName { get; set; } = string.Empty;
            public int Age { get; set; }
            public string? Description { get; set; }
            public string LookingFor { get; set; } = string.Empty;
            public string PreferredAgeRange { get; set; } = string.Empty;
            public string? Interests { get; set; }
        }
    }
}