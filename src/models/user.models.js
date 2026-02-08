import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
  },
  password: {
    type: String,
    // required: [true, 'Please provide password']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email'],
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'host', 'admin'],
    default: 'user',
  },

 
  fullName: {
    type: String,
    default: '',
  },
  profilePhoto: {
    type: String, // store image URL or path
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // optional
  },
  preferredLanguages: {
  type: [String],
  default: ['en'], // default to English
  enum: [
    'en', // English
    'es', // Spanish
    'fr', // French
    'de', // German
    'zh', // Chinese (Mandarin)
    'hi', // Hindi
    'ar', // Arabic
    'pt', // Portuguese
    'ru', // Russian
    'ja', // Japanese
    'bn', // Bengali
    'pa', // Punjabi
    'ko', // Korean
    'it', // Italian
    'tr', // Turkish
  ],
},

  currentCity: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
},
{ timestamps: true } // adds createdAt and updatedAt
);
const User=mongoose.models.User || mongoose.model('User',userSchema)
export default User