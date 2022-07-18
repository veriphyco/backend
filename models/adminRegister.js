import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, unique: false },
  lastName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: false },
  phoneNumber: { type: Number, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  date: {
    type: Date,
    default: Date.now,
  },
});

const registeredAdminDetails = mongoose.model(
  "veriphy_admin_data",
  userSchema
);
export default registeredAdminDetails;
