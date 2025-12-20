using DatingWebsite.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingWebsite.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Interest> Interests { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Chat> Chats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Индексы для оптимизации
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Message>()
                .HasIndex(m => new { m.SenderId, m.ReceiverId });

            modelBuilder.Entity<Chat>()
                .HasIndex(c => new { c.User1Id, c.User2Id })
                .IsUnique();

            // Начальные интересы
            modelBuilder.Entity<Interest>().HasData(
                new Interest { Id = 1, Name = "Кино", Category = "Развлечения" },
                new Interest { Id = 2, Name = "Музыка", Category = "Развлечения" },
                new Interest { Id = 3, Name = "Книги", Category = "Образование" },
                new Interest { Id = 4, Name = "Спорт", Category = "Активный отдых" },
                new Interest { Id = 5, Name = "Путешествия", Category = "Отдых" },
                new Interest { Id = 6, Name = "Фотография", Category = "Творчество" },
                new Interest { Id = 7, Name = "Кулинария", Category = "Дом" },
                new Interest { Id = 8, Name = "Программирование", Category = "IT" },
                new Interest { Id = 9, Name = "Игры", Category = "Развлечения" },
                new Interest { Id = 10, Name = "Танцы", Category = "Творчество" }
            );
        }
    }
}