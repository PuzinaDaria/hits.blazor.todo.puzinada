using DatingWebsite.Data.Models;

namespace DatingWebsite.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(string email, string password, string firstName, string lastName,
                                 int age, string description, string lookingFor,
                                 string preferredAgeRange, string interests);
        Task<User?> LoginAsync(string email, string password);
        void Logout();
        User? CurrentUser { get; }
        bool IsAuthenticated { get; }
    }
}