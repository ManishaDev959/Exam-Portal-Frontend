namespace ExamPortal.Domain.Entities
{
   public class ResultInfo
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;

    public static ResultInfo SuccessResult(string message)
        => new ResultInfo { Success = true, Message = message };

    public static ResultInfo Failure(string message)
        => new ResultInfo { Success = false, Message = message };
}


}