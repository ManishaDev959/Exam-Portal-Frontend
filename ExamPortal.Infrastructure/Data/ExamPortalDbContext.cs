using ExamPortal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamPortal.Infrastructure.Data
{
    public class ExamPortalDbContext : DbContext
    {
        public ExamPortalDbContext(DbContextOptions<ExamPortalDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ExamForm> ExamForms { get; set; }
        public DbSet<Payment> Payments { get; set; }

        public DbSet<ExamApplication> ExamApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure ExamApplication relationships
            modelBuilder.Entity<ExamApplication>()
                .HasOne(a => a.User)
                .WithMany() // or .WithMany(u => u.Applications) if you have a navigation
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict); // ✅ prevent cascade loops

            modelBuilder.Entity<ExamApplication>()
                .HasOne(a => a.ExamForm)
                .WithMany() // or .WithMany(e => e.Applications)
                .HasForeignKey(a => a.ExamFormId)
                .OnDelete(DeleteBehavior.Restrict); // ✅ prevent multiple cascade paths
        }

    }
}
