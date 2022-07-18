
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
 
    selfie: { 
        type: String 
    } ,
  
  date: {
    type: Date,
    default: Date.now,
    
  },
});

const uploadPhotoUser = mongoose.model(             
  "Images_Upload_from_client",
  userSchema
);
export default uploadPhotoUser;
