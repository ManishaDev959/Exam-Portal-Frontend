import React, { useEffect, useState } from "react";
import ApplyExamForm from "../components/ApplyExamForm";

interface ExamForm {
  examFormId: number;
  subjects: string;
  fee: number;
  status: string;
}

export default function UserDashboard() {
  const [appliedCount, setAppliedCount] = useState<number>(0);
  const [openForms, setOpenForms] = useState<ExamForm[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamForm | null>(null);
  const [appliedExamIds, setAppliedExamIds] = useState<number[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserDashboard();
  }, []);

  const fetchUserDashboard = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/Exam/user-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user dashboard data");

      const data = await res.json();
      console.log("📦 Dashboard data:", data);

      setAppliedCount(data.appliedCount);
      setAppliedExamIds(data.appliedExamIds || []);
      setOpenForms(data.availableExams || []);
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      alert("Error fetching dashboard data");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Dashboard</h2>

      {/* ✅ Applied Forms Count */}
      <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-blue-700">
          You have applied for: <span className="font-bold">{appliedCount}</span> exam(s)
        </h3>
      </div>

      {/* ✅ Open Forms */}
      <h3 className="text-lg font-medium mb-3">Available Exams</h3>
      <ul>
        {openForms.length === 0 ? (
          <p className="text-gray-600">No open exam forms right now.</p>
        ) : (
          openForms.map((exam) => {
            const alreadyApplied = appliedExamIds.includes(exam.examFormId);

            return (
              <li
                key={exam.examFormId}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <strong>{exam.subjects}</strong> — ₹{exam.fee}
                </div>
                <button
                  disabled={alreadyApplied}
                  onClick={() => setSelectedExam(exam)}
                  className={`px-4 py-2 rounded text-white ${
                    alreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {alreadyApplied ? "Applied" : "Apply"}
                </button>
              </li>
            );
          })
        )}
      </ul>
      
      {selectedExam && (
        <ApplyExamForm exam={selectedExam} onClose={() => setSelectedExam(null)} />
      )}
    </div>
  );
}
