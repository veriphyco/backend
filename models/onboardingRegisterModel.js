import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, unique: false },
  lastName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: false },
  phoneNumber: { type: Number, required: true, unique: false },
  country: { type: String, required: true, unique: false },
  selfie:{type: String, required: false, unique: false,  default: 100},
  frontIdimg:{type: String, required: false, unique: false,  default: 110},
  backIdImg:{type: String, required: false, unique: false,  default: null},
  idNumber:{type: Number, required: false, unique: false,  default: null},
  dochasProblem:{type: Boolean, required: false, unique: false,  default: false},
  docidentity:{type: String, required: false, unique: false,  default: null},
  age:{type: Number, required: false, unique: false,  default: null},
  docExpired:{type: Boolean, required: false, unique: false,  default: false},
  dateOFBirth:{type: String, required: false, unique: false,  default: null},
  sex:{type: String, required: false, unique: false,  default: null},
  documentType:{type: String, required: false, unique: false,  default: null},
  onWatchList:{type: String, required: false, unique: false,  default: null},
  fullNamesFromMeta:{type: String, required: false, unique: false,  default: null},
  validationFrom:{type: String, required: false, unique: false,  default: null},
  selfieURl:{type: String, required: false, unique: false,  default: null},
  faceMatchScore:{type: Number, required: false, unique: false,  default: null},
  AlterationDetected:{type: Boolean, required: false, unique: false,  default: false},
  pdfLink:{type: String, required: false, unique: false,  default: false},
  date: {
    type: Date,
    default: Date.now,
  },
});

const onBoardingUsersDetails = mongoose.model(
  "onboarding_information_data from client",
  userSchema
);
export default onBoardingUsersDetails;
