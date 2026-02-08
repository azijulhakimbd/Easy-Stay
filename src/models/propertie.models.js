import mongoose, { Schema } from "mongoose";
const propertySchema = new Schema({
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 1000 },
  address: { type: String, required: true, trim: true, maxlength: 200 },
  city: { type: String, required: true, trim: true, index: true, maxlength: 100 },
  state: { type: String, trim: true, maxlength: 100 },
  country: { type: String, default: 'USA', trim: true, maxlength: 100 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  pricePerNight: { type: Number, required: true, min: 0, index: true },
  roomType: { type: String, enum: ['entire_place', 'private_room', 'shared_room'], required: true, index: true },
  maxGuests: { type: Number, default: 1, min: 1, required: true },
  bedrooms: { type: Number, default: 1, min: 0, required: true },
  beds: { type: Number, default: 1, min: 0, required: true },
  bathrooms: { type: Number, default: 1, min: 0, required: true },
  checkInTime: { type: String, default: '14:00', match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
  checkOutTime: { type: String, default: '11:00', match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
  isActive: { type: Boolean, default: true },
  amenities: [{ type: Schema.Types.ObjectId, ref: 'Amenity' }],
  images: [{
    url: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false }
  }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  serviceCharge:{
    type:Number,
    min:50,
    required:true

  },
  
  guestsIncluded:{type:Number,default:0, required:true},
  discount:{
    type:Number, default:0, min:0, max:100
  },
  extraGuestFee: { type: Number, default: 0, min: 0 },
  cleaningFee: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
propertySchema.index({location:"2dsphere"}) // Geospatial index
export const Property=mongoose.models.Property || mongoose.model('Property',propertySchema)