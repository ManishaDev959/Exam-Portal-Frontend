
using System.Text.Json.Serialization;

namespace ExamPortal.Domain.Entities
{
    public class ExamForm
    {
        public int ExamFormId { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        public string Subjects { get; set; } = string.Empty;
        public decimal Fee { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
