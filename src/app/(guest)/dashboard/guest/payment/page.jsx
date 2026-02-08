"use client";

import { Suspense } from "react";
import PaymentContent from "./components/PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
