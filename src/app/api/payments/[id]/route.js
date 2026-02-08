import dbConnect from "@/lib/dbConnect";
import { Payment } from "@/models/payment.models";

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const payment = await Payment.findOne({
      $or: [{ stripeSessionId: id }, { bookingId: id }],
    });

    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}