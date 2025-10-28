namespace ExamPortal.Domain.Entities
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Stripe";
        public string Status { get; set; } = "Pending";
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    }
}
