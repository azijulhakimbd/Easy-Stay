import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  bookingId: String,
  stripePaymentIntentId: String,
  amount: Number,
  currency: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

