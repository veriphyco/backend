import express from "express";
import registeredUsersDetails from "../models/usersModels.js";
import onBoardingUsersDetails from "../models/onboardingRegisterModel.js";
import axios from "axios";
import bodyParser from "body-parser";
import pdf from 'html-pdf';
import  pdfTemplate  from '../pdfdocuments/pdfindex.js'
import puppeteer from "puppeteer";
import fs from 'fs-extra';

const router = express.Router();
let jsonParser = bodyParser.json();
router.get("/", async (req, res) => {
  res.send("api");
  console.log("api route");
});
router.get("/registred/details", async (req, res) => {
  try {
    //quering the data in aphetical order
    const users = await registeredUsersDetails.find().sort({ FirstName: 1 });
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("lami/registred/details", async (req, res) => {
  try {
    //quering the data in aphetical order
    const users = await registeredUsersDetails.find().sort({ FirstName: 1 });
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

// router.post("/createPDF",(req, res) => {

//     //quering the data in aphetical order
//     pdf.create(pdfTemplate(req.body), {}).toFile('details.pdf', (err)=>{
//       if(err){
//         res.send(promise.reject());
//       }
//       res.send(promise.resolve());
//     })
 
// });

// router.get("/getPDF",(req, res) => {
// res.sendFile(`${__dirname}/details.pdf`)
//   //quering the data in aphetical order
//   pdf.create(pdfTemplate(req.body), {}).toFile('details.pdf', (err)=>{
//     if(err){
//       promise.reject();
//     }
//     return promise.resolve();
//   })

// });

router.post("/ujumbesms", jsonParser, async (req, res) => {
  const phoneNumbers = JSON.stringify(req.body.phoneNumber);
  const otpnos = JSON.stringify(req.body.otpno);
  console.log(phoneNumbers);
  try {
    const data = await axios({
      url: "https://ujumbesms.co.ke/api/messaging",
      method: "post",
      data: {
        data: [
          {
            message_bag: {
              numbers: phoneNumbers,
              message: `Your OTP token is ${req.body.otpno}`,
              sender: "VERIPHY",
            },
          },
        ],
      },
      headers: {
        "content-Type": "application/json",
        "X-Authorization": "ZjcwZGY5MDFhNTUyYjFlOTQ2NDBkYzYzNWIyZWUx",
        email: "info@veriphy.co",
        "Cache-Control": "no-cache",
      },
    });
    res.send("sent");
  } catch (err) {
    console.log(err);
    //console.log("could not query data");
  }
});

//onboardong process users registration
router.get("/onboarding/registeredusers", async (req, res) => {  
  
  try {
    const users = await onBoardingUsersDetails.find().sort({_id:-1});
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  //  res.send("not uploaded");
  }
  
});
export default router;
