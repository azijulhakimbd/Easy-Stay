"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { email } from "zod";

export default function PaymentPage() {
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const amount = searchParams.get("amount");
  const propertyId = searchParams.get("propertyId");
  const {data:session}=useSession();
      const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {

    setLoading(true);
    try {
      const response = await axios.post('/api/checkout', {
        bookingId,
        amount: parseFloat(amount),
        userId:session?.user?._id,
         email:session?.user?.email,
        propertyId
      });
      const { url } = response.data;
      console.log(response.data, 'Checkout URL:', url);
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
  
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Payment Page</h1>
      <div className="border p-4 rounded shadow">
        <p><strong>Booking ID:</strong> {bookingId}</p>
        <p><strong>Amount:$</strong> {amount}</p>
        
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-blue-500 my-4 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >PAY Now</Button>
      </div>
    </div>
  );
}
