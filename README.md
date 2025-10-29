
Before running the project, ensure you have:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or LocalDB)
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or VS Code with C# extension

---

-> Setup Instructions

-> Clone the Repository
```bash
git clone https://github.com/ManishaDev959/Exam-Portal.git
cd Exam-Portal
git checkout backend

```bash 
dotnet restore


Open appsettings.json and update the ConnectionString section:

"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ExamPortalDB;Trusted_Connection=True;"
}

```bash 
dotnet ef database update
dotnet run 

The code will start at 

https://localhost:7248
http://localhost:5248

// Change the port if needed


