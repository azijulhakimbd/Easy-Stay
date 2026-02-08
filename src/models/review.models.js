import mongoose from "mongoose";
import { Schema } from "mongoose";
const reviewSchema = new Schema({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 500 },
  photos: { type: [String], default: [] },
  verified: { type: Boolean, default: false },
  adminReply: { type: String, trim: true, default: "" }

}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)