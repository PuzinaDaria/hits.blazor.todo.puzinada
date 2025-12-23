using System.ComponentModel.DataAnnotations;

namespace DatingWebsite.Data.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Некорректный email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        public string Password { get; set; } = string.Empty; // Убрали MinLength

        [Required(ErrorMessage = "Имя обязательно")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Фамилия обязательна")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Возраст обязателен")]
        [Range(18, 100, ErrorMessage = "Возраст 18-100")]
        public int Age { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "Укажите, кого ищете")]
        public string LookingFor { get; set; } = string.Empty;

        [Required(ErrorMessage = "Укажите возрастной диапазон")]
        public string PreferredAgeRange { get; set; } = string.Empty;

        public string Interests { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}