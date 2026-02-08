import { z } from "zod";

const propertySchema = z.object({
  hostId: z.string().nonempty("Host ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().optional(),
  country: z.string().nonempty("Country is required"),
  latitude: z.coerce.number().optional(), // Temp field for form
  longitude: z.coerce.number().optional(), // Temp field for form
  pricePerNight: z.coerce.number().min(0, "Price must be non-negative"),
  roomType: z.enum(["entire_place", "private_room", "shared_room"]),
  maxGuests: z.coerce.number().min(1, "Must allow at least 1 guest"),
  bedrooms: z.coerce.number().min(1, "Must have at least 1 bedroom"),
  beds: z.coerce.number().min(1, "Must have at least 1 bed"),
  bathrooms: z.coerce.number().min(1, "Must have at least 1 bathroom"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  amenities: z.array(z.string()).optional(),
   cleaningFee: z.coerce.number().min(5, "Cleaning fee is compulsory not less then 5 dollar"),
    extraGuestFee: z.coerce.number().min(0, ),
     guestsIncluded: z.coerce.number().min(0, ),
      serviceCharge: z.coerce.number().min(50, " At least 50 dollar"),
      discount:z.coerce.number(),
  images: z.array(
    z.object({
      url: z.string().url("Invalid URL").nonempty("Image URL is required"),
      isPrimary: z.boolean(),
    })
  ).min(1, "At least one image is required"),
  isActive: z.boolean(),
});
export default propertySchema;