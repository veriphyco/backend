import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, unique: false },
  lastName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: false },
  phoneNumber: { type: Number, required: true, unique: false },
  country: { type: String, required: true, unique: false },
  frontIdimg: { type: String, required: true, unique: false },
  // backIdimg: { data: Buffer, contentType: String },
  // kraimg: { data: Buffer, contentType: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

const registeredUsersUploads = mongoose.model(
  "lami_information_data from client",
  userSchema
);
export default registeredUsersUploads;
