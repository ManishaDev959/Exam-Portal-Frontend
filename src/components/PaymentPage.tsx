import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { jsPDF } from "jspdf";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51SN5mZ1NitsVjD0fiyNBjRTEzKXqEy1DYrE5Q9YPBRzlnpFacNh6mao45KkEDu06dZ1PXhKp1Qoe1lc7JwHPWQz700r9uDfWXP");

function CheckoutForm({
  examFormId,
  examSubject,
  fee,
  onSuccess,
}: {
  examFormId: number;
  examSubject: string;
  fee: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Simulating payment for exam", examFormId);
      await new Promise((r) => setTimeout(r, 1500));


      await fetch(`http://localhost:8000/api/Exam/apply/${examFormId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

    
      const doc = new jsPDF();
      const date = new Date().toLocaleString();

      doc.setFontSize(18);
      doc.text("Exam Application Receipt", 70, 20);

      doc.setFontSize(12);
      doc.text(`Receipt ID: R-${Math.floor(Math.random() * 100000)}`, 20, 40);
      doc.text(`Exam Form ID: ${examFormId}`, 20, 50);
      doc.text(`Subject: ${examSubject}`, 20, 60);
      doc.text(`Fee Paid: ₹${fee}`, 20, 70);
      doc.text(`Date: ${date}`, 20, 80);
      doc.text("Status: Applied Successfully ✅", 20, 100);
      doc.text("Thank you for applying through Exam Portal!", 20, 120);

      doc.save(`Receipt_Exam_${examFormId}.pdf`);
      setPdfDoc(doc);
      setPaymentSuccess(true);

      onSuccess();
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { examFormId } = useParams<{ examFormId: string }>();
  const location = useLocation();
  const navigate = useNavigate();


  const { examSubject, fee } = location.state || {
    examSubject: "Unknown Subject",
    fee: 0,
  };

  if (!examFormId) return <p>Invalid Exam ID</p>;

  const handleSuccess = () => {
    console.log("Payment success for exam:", examFormId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Pay for Exam #{examFormId}
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Subject: <strong>{examSubject}</strong> | Fee: <strong>₹{fee}</strong>
        </p>
        <p className="text-gray-500 text-sm text-center mb-6">
          Use any Stripe test card (e.g. 4242 4242 4242 4242, 12/34, 123)
        </p>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            examFormId={parseInt(examFormId)}
            examSubject={examSubject}
            fee={fee}
            onSuccess={handleSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}
