using DatingWebsite.Data;
using DatingWebsite.Data.Models;
using System.Security.Cryptography;
using System.Text;

namespace DatingWebsite.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(User user);
        Task<User?> LoginAsync(string email, string password);
        void Logout();
        User? CurrentUser { get; }
        bool IsAuthenticated { get; }
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private User? _currentUser;

        public User? CurrentUser => _currentUser;
        public bool IsAuthenticated => _currentUser != null;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        public async Task<User?> RegisterAsync(User user)
        {
            if (_context.Users.Any(u => u.Email == user.Email))
                return null;

            user.Password = HashPassword(user.Password);
            user.CreatedAt = DateTime.Now;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _currentUser = user;
            return user;
        }

        public async Task<User?> LoginAsync(string email, string password)
        {
            var hashedPassword = HashPassword(password);
            var user = _context.Users.FirstOrDefault(u => u.Email == email && u.Password == hashedPassword);

            if (user != null)
            {
                _currentUser = user;
            }

            return user;
        }

        public void Logout()
        {
            _currentUser = null;
        }
    }
}