using DatingWebsite.Data.Models;

namespace DatingWebsite.Services
{
    public interface IUserService
    {
        // Пользователи
        Task<List<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task UpdateUserAsync(User user);

        // Интересы
        Task<List<Interest>> GetInterestsAsync();

        // Чаты и сообщения
        Task<List<Chat>> GetUserChatsAsync(int userId);
        Task<List<Message>> GetChatMessagesAsync(int user1Id, int user2Id);
        Task SendMessageAsync(int senderId, int receiverId, string content);
        Task<Chat?> GetOrCreateChatAsync(int user1Id, int user2Id);
    }
}