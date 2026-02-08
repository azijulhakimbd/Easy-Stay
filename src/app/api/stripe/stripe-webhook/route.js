import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";
import { Payment } from "@/models/payment.models";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // Required for raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error(" Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    console.log("✅ Received Stripe webhook:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const paymentIntentId = session.payment_intent;
      const bookingId = session.metadata?.booking_id;
      const propertyId = session.metadata?.propertyId;

      console.log("💡 Metadata received:", session.metadata);

      await dbConnect();

      // Update booking payment status
      await Booking.findByIdAndUpdate(
        bookingId,
        { payment_status: "success", updated_at: new Date() },
        { new: true }
      );

      // Record payment
      await Payment.findOneAndUpdate(
        { bookingId },
        {
          stripePaymentIntentId: paymentIntentId,
          status: "succeeded",
          createdAt: new Date(),
          propertyId,
        },
        { upsert: true, new: true }
      );

      console.log(`Updated booking ${bookingId} payment to success`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}