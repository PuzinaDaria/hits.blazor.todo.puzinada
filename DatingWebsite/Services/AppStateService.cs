using DatingWebsite.Data.Models;
using Microsoft.JSInterop;
using System.Text.Json;

namespace DatingWebsite.Services
{
    public class AppStateService
    {
        public User? CurrentUser { get; set; }
        public bool IsAuthenticated => CurrentUser != null;

        public event Action? OnChange;


        public void SetUser(User? user)
        {
            CurrentUser = user;
            NotifyStateChanged();
        }

        public void SetUserFromJson(string json)
        {
            try
            {
                var userData = JsonSerializer.Deserialize<UserData>(json);
                if (userData != null)
                {
                    CurrentUser = new User
                    {
                        Id = userData.Id,
                        Email = userData.Email,
                        FirstName = userData.FirstName,
                        LastName = userData.LastName,
                        Age = userData.Age
                    };

                    NotifyStateChanged(); // ⚠️ ВАЖНО: вызываем уведомление!
                    Console.WriteLine($"Пользователь восстановлен из localStorage: {CurrentUser.Email}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при десериализации: {ex.Message}");
            }
        }

        private void NotifyStateChanged() => OnChange?.Invoke();

        public async Task SyncFromLocalStorage(IJSRuntime jsRuntime)
        {
            try
            {
                var userJson = await jsRuntime.InvokeAsync<string>("localStorage.getItem", "currentUser");
                if (!string.IsNullOrEmpty(userJson))
                {
                    SetUserFromJson(userJson);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка синхронизации: {ex.Message}");
            }
        }

        public void Logout()
        {
            CurrentUser = null;
            NotifyStateChanged(); // Важно: уведомляем об изменении
        }



        // Вспомогательный класс для десериализации из localStorage
        private class UserData
        {
            public int Id { get; set; }
            public string Email { get; set; } = string.Empty;
            public string FirstName { get; set; } = string.Empty;
            public string LastName { get; set; } = string.Empty;
            public int Age { get; set; }
        }
    }
}