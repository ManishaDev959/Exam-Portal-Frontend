using ExamPortal.Domain.Entities;

namespace ExamPortal.Application.Interfaces
{
    public interface IUserService
    {
        Task<User?> AuthenticateUser(string email, string password);
        Task RegisterUser(User user, string password);
    }
}
