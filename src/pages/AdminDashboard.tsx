import { useEffect, useState } from "react";
import axios from "axios";
import ExamForm from "../models/ExamForm";

export default function AdminDashboard() {
  const [exams, setExams] = useState<ExamForm[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [subjects, setSubjects] = useState("");
  const [fee, setFee] = useState("");
  const [editingExam, setEditingExam] = useState<ExamForm | null>(null);
  const [formData, setFormData] = useState({ subjects: "", fee: "", status: "" });
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) fetchExams();
  }, [token]);

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/Exam/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err: any) {
      console.error("Failed to fetch exams:", err);
      if (err.response?.status === 401) {
        alert("Unauthorized — please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  const createExam = async () => {
    if (!subjects || !fee) return alert("Please enter subjects and fee.");
    try {
      await axios.post(
        "http://localhost:8000/api/Exam/create",
        { subjects, fee: parseFloat(fee) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects("");
      setFee("");
      fetchExams();
    } catch (err) {
      console.error(err);
      alert("Failed to create exam");
    }
  };

  const deleteExam = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/Exam/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExams();
    } catch (err) {
      console.error("Failed to delete exam:", err);
    }
  };

  const startEditing = (exam: ExamForm) => {
    setEditingExam(exam);
    setFormData({
      subjects: exam.subjects,
      fee: exam.fee.toString(),
      status: exam.status,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingExam) return;

    try {
      await axios.put(
        `http://localhost:8000/api/Exam/update/${editingExam.examFormId}`,
        {
          subjects: formData.subjects,
          fee: parseFloat(formData.fee),
          status: formData.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Exam updated successfully");
      setEditingExam(null);
      fetchExams();
    } catch (err) {
      console.error("Error updating exam:", err);
      alert("Failed to update exam");
    }
  };

  const fetchSubmissions = async (examFormId: number) => {
  try {
    const res = await fetch(`http://localhost:8000/api/Exam/submissions/${examFormId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!res.ok) throw new Error("Failed to fetch submissions");

    const data = await res.json();
    setSubmissions(data.applicants || []);
    setShowModal(true);
  } catch (err) {
    console.error(err);
    alert("No submissions found or error fetching data");
  }
};


  const toggleExamStatus = async (examFormId: number) => {
    try {
      await fetch(`http://localhost:8000/api/Exam/toggle-status/${examFormId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Exam status updated successfully!");
      fetchExams(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

      {/* Create Exam */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Create Exam Form</h3>
        <input
          type="text"
          placeholder="Subjects"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={createExam}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Exam
        </button>
      </div>

      {/* All Exams */}
      <h3 className="text-lg font-medium mb-2">All Exams</h3>
      <ul>
        {exams.map((exam) => (
          <li
            key={exam.examFormId}
            className="mb-2 border-b py-2 flex justify-between items-center"
          >
            <div>
              <strong>{exam.subjects}</strong> — ₹{exam.fee}
            </div>

            <div className="space-x-2">
              <button
                onClick={() => fetchSubmissions(exam.examFormId)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                View Submissions
              </button>

              <button
                onClick={() => startEditing(exam)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteExam(exam.examFormId)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>

              <button
                onClick={() => toggleExamStatus(exam.examFormId)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                {exam.status === "Open" ? "Close" : "Open"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Form */}
      {editingExam && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">
            Editing: {editingExam.subjects}
          </h3>
          <input
            name="subjects"
            value={formData.subjects}
            onChange={handleInputChange}
            placeholder="Subjects"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            name="fee"
            value={formData.fee}
            onChange={handleInputChange}
            placeholder="Fee"
            type="number"
            className="w-full p-2 border rounded mb-2"
          />
      
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingExam(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Applicants ({submissions.length})
            </h2>

            {submissions.length === 0 ? (
              <p className="text-gray-500 text-center">No applicants yet.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((applicant, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border p-2">{applicant.name}</td>
                      <td className="border p-2">{applicant.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
