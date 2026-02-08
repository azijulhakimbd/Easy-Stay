"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function InvoicePage() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/payments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPayment(data);
        setLoading(false);
      });
  }, [id]);
console.log(payment)
  const handleDownloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);

  doc.setFontSize(12);
  doc.text(`Invoice ID: ${payment._id}`, 14, 30);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 14, 40);
  doc.text(`User Email: ${payment.email}`, 14, 50);
  doc.text(`Payment Status: ${payment.status}`, 14, 60);

  autoTable(doc, {
    startY: 70,
    head: [["Description", "Amount", "Currency"]],
    body: [
      ["Property Booking", payment?.amount, "$"],
    ],
  });

  const finalY = doc.lastAutoTable.finalY || 100;
  doc.text("Thank you for your payment!", 14, finalY + 20);

  doc.save(`Invoice-${payment._id}.pdf`);
};

  if (loading) return <p className="text-center mt-10">Loading invoice...</p>;
  if (!payment) return <p className="text-center mt-10 text-red-500">Invoice not found</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10 border">
      <h1 className="text-2xl font-bold mb-4 text-center">Payment Invoice</h1>

      <div className="space-y-3">
        <p><strong>Invoice ID:</strong> {payment._id}</p>
        <p><strong>Booking ID:</strong> {payment.bookingId}</p>
        <p><strong>User Email:</strong> {payment.email}</p>
        <p><strong>Amount:</strong> ${payment.amount} {payment.currency}</p>
        <p><strong>Status:</strong> <span className="text-green-600">{payment.status}</span></p>
        <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
}