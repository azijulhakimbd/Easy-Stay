import mongoose from "mongoose";

const hostApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Resort", "Other"],
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export  const HostApplication = mongoose.models.HostApplication || mongoose.model("HostApplication", hostApplicationSchema);