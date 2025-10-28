namespace ExamPortal.Domain.Entities
{
    public class ExamApplication
    {
        public int ExamApplicationId  { get; set; }
        public int UserId { get; set; }
        public int ExamFormId { get; set; }
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public ExamForm? ExamForm { get; set; }
    }
}
