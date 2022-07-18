import mongoose from "mongoose";
const phoneNumberSchema = new mongoose.Schema({
  phoneNumber: { type: Number, required: true, unique: false },
  date: {
    type: Date,
    default: Date.now,
  },
});

const registeredphoneDetails = mongoose.model(
  "veriphy_PhoneNumber_data",
  phoneNumberSchema
);
export default registeredphoneDetails;
