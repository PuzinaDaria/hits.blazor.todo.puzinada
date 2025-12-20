namespace DatingWebsite.Data.Models
{
    public class Chat
    {
        public int Id { get; set; }
        public int User1Id { get; set; }
        public int User2Id { get; set; }
        public DateTime LastMessageAt { get; set; }
        public string LastMessagePreview { get; set; } = string.Empty;
    }
}