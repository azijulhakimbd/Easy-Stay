import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";
import { Payment } from "@/models/payment.models";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log(webhookSecret,"this is webhook secret",process.env.STRIPE_SECRET_KEY,"this is secret key")

  let event;

  try {
    // ✅ Use raw bytes instead of text
    const rawBody = Buffer.from(await request.arrayBuffer());
    const signature = request.headers.get("stripe-signature");

    // ✅ Verify signature
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    console.log(" Verified Stripe webhook:", event.type);
  } catch (err) {
    console.error(" Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Handle events
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { booking_id, propertyId, email, amount } = session.metadata || {};

      console.log("💡 Metadata received:", session.metadata);

      await dbConnect();

      // Update booking payment status
      await Booking.findByIdAndUpdate(
        booking_id,
        {
          payment_status: "success",
          status: "completed",
          updatedAt: new Date(),
        },
        { new: true }
      );

      // Record payment
      await Payment.findOneAndUpdate(
        { bookingId: booking_id },
        {
          stripePaymentIntentId: session.payment_intent,
          status: "succeeded",
          createdAt: new Date(),
          propertyId,
          email,
          amount,
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(" Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
