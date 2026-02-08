import Stripe from "stripe";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Payment } from "@/models/payment.models";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  const { amount, userId, email,bookingId ,propertyId} = await req.json();

   await Payment.create({
      userId,
      email,
      amount,
      currency: "usd",
      stripeSessionId: null,
      propertyId,
      status: "not_paid",
      stripePaymentIntentId:null
    });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Room Booking Payment" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/guest/payments`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
      metadata: { booking_id:bookingId, email,userId,propertyId,amount },
    });
  
    
   
 return NextResponse.json( { url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}