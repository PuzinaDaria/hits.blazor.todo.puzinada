using DatingWebsite.Data.Models;
using Microsoft.JSInterop;

namespace DatingWebsite.Services
{
    public class AuthService
    {
        private readonly IJSRuntime _jsRuntime;
        private User? _currentUser;

        public User? CurrentUser => _currentUser;
        public bool IsAuthenticated => _currentUser != null;

        public AuthService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task LoginAsync(string email, string password)
        {
            // Простая заглушка
            if (email == "test@example.com" && password == "123456")
            {
                _currentUser = new User
                {
                    Id = 1,
                    Email = email,
                    FirstName = "Тест",
                    LastName = "Пользователь",
                    Age = 25
                };

                // Сохраняем в localStorage
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "isLoggedIn", "true");
            }
        }

        public async Task LogoutAsync()
        {
            _currentUser = null;
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", "isLoggedIn");
        }

        public async Task CheckAuthAsync()
        {
            try
            {
                // Проверяем localStorage
                var isLoggedIn = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "isLoggedIn");

                if (isLoggedIn == "true")
                {
                    _currentUser = new User
                    {
                        Id = 1,
                        Email = "test@example.com",
                        FirstName = "Тест",
                        LastName = "Пользователь",
                        Age = 25
                    };
                }
            }
            catch
            {
                // Игнорируем ошибки
            }
        }
    }
}