using System.ComponentModel.DataAnnotations;

namespace FeedbackHandler.Models
{
    public class Feedback
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public int Phone { get; set; }
        public string Email { get; set; }
        [Required]
        public string Message { get; set; }
    }
}