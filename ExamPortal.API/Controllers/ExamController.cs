using ExamPortal.Application.Interfaces;
using ExamPortal.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExamPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examService;

        public ExamController(IExamService examService)
        {
            _examService = examService;
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateExam([FromBody] ExamForm exam)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                              User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Invalid token. User not found.");

            exam.UserId = int.Parse(userIdClaim);
            exam.CreatedAt = DateTime.UtcNow;

            await _examService.CreateExamForm(exam);
            return Ok("Exam form created successfully.");
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllExams()
        {
            var exams = await _examService.GetAllExamForms();
            return Ok(exams);
        }

        [HttpGet("available")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetAvailableExams()
        {
            var exams = await _examService.GetAvailableExamForms();
            return Ok(exams);
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateExamForm(int id, [FromBody] ExamForm updatedForm)
        {
            var existingForm = await _examService.GetExamFormById(id);
            if (existingForm == null)
                return NotFound("Exam form not found");

            existingForm.Subjects = updatedForm.Subjects;
            existingForm.Fee = updatedForm.Fee;
            existingForm.Status = updatedForm.Status;

            await _examService.UpdateExamForm(existingForm);
            return Ok("Exam form updated successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            await _examService.DeleteExamForm(id);
            return Ok("Exam form deleted successfully.");
        }

        [HttpPost("apply/{examFormId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ApplyForExam(int examFormId)
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("User ID not found in token.");

            int userId = int.Parse(userIdClaim);
            var result = await _examService.ApplyForExam(examFormId, userId);
            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(new { message = "Applied successfully" });
        }



        [HttpPut("toggle-status/{examFormId}")]
        public async Task<IActionResult> ToggleExamStatus(int examFormId)
        {
            var result = await _examService.ToggleExamStatus(examFormId);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }



        [HttpGet("submissions/{examFormId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetExamSubmissions(int examFormId)
        {
            var applicants = await _examService.GetApplicantsByExamId(examFormId);

            if (applicants == null || !applicants.Any())
                return Ok(new { count = 0, applicants = new List<object>() });

            var result = applicants.Select(u => new
            {
                // u.UserId,
                u.Name,
                u.Email
            });

            return Ok(new
            {
                count = result.Count(),
                applicants = result
            });
        }


        [HttpGet("user-dashboard")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetUserDashboard()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("Invalid user.");

            int userId = int.Parse(userIdClaim.Value);

            var result = await _examService.GetUserDashboardData(userId);

            return Ok(result);
        }
    }
}
