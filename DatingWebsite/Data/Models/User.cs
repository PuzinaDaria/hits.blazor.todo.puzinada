using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        [MinLength(6, ErrorMessage = "Минимум 6 символов")]
        public string Password { get; set; } = string.Empty;

        [NotMapped]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Имя обязательно")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Фамилия обязательна")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Возраст обязателен")]
        [Range(18, 100, ErrorMessage = "Возраст 18-100")]
        public int Age { get; set; }

        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Укажите, кого ищете")]
        public string LookingFor { get; set; } = string.Empty;

        [Required(ErrorMessage = "Укажите возрастной диапазон")]
        public string PreferredAgeRange { get; set; } = string.Empty;

        public string Interests { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}