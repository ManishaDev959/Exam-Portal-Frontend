using ExamPortal.Application.Interfaces;
using ExamPortal.Domain.Entities;
using ExamPortal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ExamPortal.Application.Services
{
    public class ExamService : IExamService
    {
        private readonly ExamPortalDbContext _context;

        public ExamService(ExamPortalDbContext context)
        {
            _context = context;
        }

        public async Task CreateExamForm(ExamForm exam)
        {
            await _context.ExamForms.AddAsync(exam);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ExamForm>> GetAllExamForms()
        {
            return await _context.ExamForms
                .Include(e => e.User)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ExamForm>> GetExamFormsByUserId(int userId)
        {
            return await _context.ExamForms
                .Where(e => e.UserId == userId)
                .Include(e => e.User)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }

        public async Task<ExamForm?> GetExamFormById(int id)
        {
            return await _context.ExamForms.FindAsync(id);
        }

        public async Task UpdateExamForm(ExamForm exam)
        {
            _context.ExamForms.Update(exam);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteExamForm(int examFormId)
        {
            var form = await _context.ExamForms.FindAsync(examFormId);
            if (form != null)
            {
                _context.ExamForms.Remove(form);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<ExamForm>> GetAvailableExamForms()
        {
            
            return await _context.ExamForms
                .Where(e => e.Status == "Open")
                .ToListAsync();
        }


        public async Task<List<User>> GetApplicantsByExamId(int examFormId)
        {
            var applicants = await _context.ExamApplications
                .Where(e => e.ExamFormId == examFormId)
                .Select(e => e.User)
                .ToListAsync();

            return applicants ?? new List<User>();
        }


        public async Task<ResultInfo> ToggleExamStatus(int examFormId)
        {
            var exam = await _context.ExamForms.FindAsync(examFormId);
            if (exam == null)
                return ResultInfo.Failure("Exam form not found.");


            exam.Status = exam.Status == "Open" ? "Closed" : "Open";

            _context.ExamForms.Update(exam);
            await _context.SaveChangesAsync();

            return ResultInfo.SuccessResult($"Exam status changed to {exam.Status}");
        }


        public async Task<ResultInfo> ApplyForExam(int examFormId, int userId)
        {
            var alreadyApplied = await _context.ExamApplications
                .AnyAsync(a => a.ExamFormId == examFormId && a.UserId == userId);

            if (alreadyApplied)
                return ResultInfo.Failure("You have already applied for this exam.");

            var application = new ExamApplication
            {
                UserId = userId,
                ExamFormId = examFormId
            };

            _context.ExamApplications.Add(application);
            await _context.SaveChangesAsync();

            return ResultInfo.SuccessResult("Application successful!");
        }



        public async Task<object> GetUserDashboardData(int userId)
        {
            var appliedCount = await _context.ExamApplications
                .Where(a => a.UserId == userId)
                .CountAsync();

            var userApplications = await _context.ExamApplications
                .Where(a => a.UserId == userId)
                .Select(a => new { a.ExamFormId })
                .ToListAsync();

            var openForms = await _context.ExamForms
                .Where(e => e.Status == "Open")
                .Select(e => new
                {
                    e.ExamFormId,
                    e.Subjects,
                    e.Fee,
                    e.Status
                })
                .ToListAsync();

            return new
            {
                appliedCount,
                appliedExamIds = userApplications.Select(a => a.ExamFormId).ToList(),
                availableExams = openForms
            };
        }
    }
}
