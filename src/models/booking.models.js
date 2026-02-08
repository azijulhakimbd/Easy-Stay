import mongoose from "mongoose";
import { Schema } from "mongoose";
const bookingSchema = new Schema({
  propertyId: { 
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true 
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
    hostId: {  // 🏠 The property owner
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    default: 1, min: 1,
    required: true
  },
  status: {
    type: String,
    enum: ['pending','approved', 'cancelled','rejected', 'completed'],
    default: 'pending',
    required: true
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)