using ExamPortal.Domain.Entities;

namespace ExamPortal.Application.Interfaces
{
    public interface IExamService
    {
        Task CreateExamForm(ExamForm exam);
        Task<IEnumerable<ExamForm>> GetAllExamForms();
        Task<IEnumerable<ExamForm>> GetExamFormsByUserId(int userId);
        Task UpdateExamForm(ExamForm exam);
        Task DeleteExamForm(int examFormId);
        Task<ExamForm?> GetExamFormById(int id);
        Task<List<ExamForm>> GetAvailableExamForms();

        Task<ResultInfo> ApplyForExam(int examFormId, int userId);

        Task<List<User>> GetApplicantsByExamId(int examFormId);

        Task<ResultInfo> ToggleExamStatus(int examFormId);

        Task<object> GetUserDashboardData(int userId);


    }
}
