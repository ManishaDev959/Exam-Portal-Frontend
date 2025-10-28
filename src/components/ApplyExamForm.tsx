import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ApplyExamFormProps {
  exam: {
    examFormId: number;
    subjects: string;
    fee: number;
  };
  onClose: () => void;
}

export default function ApplyExamForm({ exam, onClose }: ApplyExamFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = async () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Full Name is required");
      return;
    }

    // localStorage.setItem("examApplication", JSON.stringify({
    //   ...formData,
    //   examFormId: exam.examFormId,
    //   subjects: exam.subjects,
    //   fee: exam.fee,
    // }));

    navigate(`/payment/${exam.examFormId}`, {
      state: { examSubject: exam.subjects, fee: exam.fee },
    });

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Apply for <span className="text-blue-600">{exam.subjects}</span>
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Exam Fee: <strong>₹{exam.fee}</strong>
        </p>

        <div className="space-y-3">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={handleProceed}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
