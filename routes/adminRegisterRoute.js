import express from "express";
import registeredAdminDetails from "../models/adminRegister.js";
import joi from "@hapi/joi";
import bcrypt from "bcryptjs";


const router = express.Router(); 

router.post("/register", async (req, res) => { 
    const eamilExist = await registeredAdminDetails.findOne({
        email: req.body.email,
      });
      
      if (eamilExist) return res.send("Email already Exist");

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newAdmin = new registeredAdminDetails({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password:hashPassword,
     
    });
    try {
      const savedUsers = await newAdmin.save();
      // res.send("Registration Success");
      res.json(savedUsers);
    } catch (err) {
      res.json({ message: err });
    //  res.send("not uploaded");
    }
    
  });

  router.post("/login", async (req, res) => {
    // console.log("called");
    //checking if the EMAIL EXIST
    const userExist = await registeredAdminDetails.findOne({
      email: req.body.email,
    });
    // console.log(userExist);
    if (!userExist) return res.send("Email does not Exist");
  
    const validPassword = await bcrypt.compare(
      req.body.password,
      userExist.password
    );
    //console.log(req.body.password);
    // console.log(userExist.password);
    if (!validPassword) return res.send("Invalid Password or Email");
  
    res.send("logged in ");
    // const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
    // res.header("auth-token-solo", token).send(token);
  });


  export default router;


