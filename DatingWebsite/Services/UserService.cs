using DatingWebsite.Data;
using DatingWebsite.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingWebsite.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Пользователи
        public async Task<List<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task UpdateUserAsync(User user)
        {
            var existing = await _context.Users.FindAsync(user.Id);
            if (existing != null)
            {
                existing.FirstName = user.FirstName;
                existing.LastName = user.LastName;
                existing.Age = user.Age;
                existing.Description = user.Description;
                existing.LookingFor = user.LookingFor;
                existing.PreferredAgeRange = user.PreferredAgeRange;
                existing.Interests = user.Interests;

                await _context.SaveChangesAsync();
            }
        }

        // Интересы
        public async Task<List<Interest>> GetInterestsAsync()
        {
            return await _context.Interests.ToListAsync();
        }

        // Чаты и сообщения
        public async Task<List<Chat>> GetUserChatsAsync(int userId)
        {
            return await _context.Chats
                .Where(c => c.User1Id == userId || c.User2Id == userId)
                .OrderByDescending(c => c.LastMessageAt)
                .ToListAsync();
        }

        public async Task<List<Message>> GetChatMessagesAsync(int user1Id, int user2Id)
        {
            return await _context.Messages
                .Where(m => (m.SenderId == user1Id && m.ReceiverId == user2Id) ||
                           (m.SenderId == user2Id && m.ReceiverId == user1Id))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task SendMessageAsync(int senderId, int receiverId, string content)
        {
            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                SentAt = DateTime.Now,
                IsRead = false
            };

            _context.Messages.Add(message);

            // Обновляем или создаем чат
            var chat = await GetOrCreateChatAsync(senderId, receiverId);
            if (chat != null)
            {
                chat.LastMessageAt = DateTime.Now;
                chat.LastMessagePreview = content.Length > 50 ? content[..50] + "..." : content;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<Chat?> GetOrCreateChatAsync(int user1Id, int user2Id)
        {
            var chat = await _context.Chats.FirstOrDefaultAsync(c =>
                (c.User1Id == user1Id && c.User2Id == user2Id) ||
                (c.User1Id == user2Id && c.User2Id == user1Id));

            if (chat == null)
            {
                chat = new Chat
                {
                    User1Id = user1Id,
                    User2Id = user2Id,
                    LastMessageAt = DateTime.Now,
                    LastMessagePreview = ""
                };
                _context.Chats.Add(chat);
                await _context.SaveChangesAsync();
            }

            return chat;
        }
    }
}