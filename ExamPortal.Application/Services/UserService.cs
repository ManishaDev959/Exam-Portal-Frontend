using ExamPortal.Application.Interfaces;
using ExamPortal.Domain.Entities;
using ExamPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace ExamPortal.Application.Services
{
    public class UserService : IUserService
    {
        private readonly ExamPortalDbContext _context;

        public UserService(ExamPortalDbContext context)
        {
            _context = context;
        }

        public async Task<User?> AuthenticateUser(string email, string password)
        {
            var userCount = await _context.Users.CountAsync(u => u.Email == email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            // if (user != null)
            // {
            //     Console.WriteLine($"Entered Password (raw): {password}");
            //     Console.WriteLine($"Hashed Entered Password: {HashPassword(password)}");
            //     Console.WriteLine($"Stored Password Hash: {user.PasswordHash}");
            //     Console.WriteLine($"Match: {HashPassword(password) == user.PasswordHash}");
            // }
            if (user == null || !VerifyPassword(password, user.PasswordHash))
            {
                Console.WriteLine("Authentication failed for user: " + email);
                return null;
            }
            return user;
        }

        public async Task RegisterUser(User user, string password)
        {
            user.PasswordHash = HashPassword(password);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }

        private static bool VerifyPassword(string password, string storedHash)
            => HashPassword(password) == storedHash;
    }
}
