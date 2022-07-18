import express from "express";
import registeredUsersDetails from "../models/usersModels.js";
import onBoardingUsersDetails from "../models/onboardingRegisterModel.js";
import registeredUsersUploads from '../models/uploadphotoModel.js'
import joi from "@hapi/joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import path from "path";

//import storage from './upload';
const router = express.Router(); 

//define storage for multer

//uplaoad parameter for malter



const storage = multer.diskStorage({
  destination:"./client/public/media/serverUploads",
  filename: (req, file, cb)=>{
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
let upload = multer({ storage: storage })
//const Users = require("../usersModels");

router.get("/", async (req, res) => {
  res.send("hahalo");
  console.log("users route");
});

const scheema = {
  password: joi.string().required,  
};
//register link for lami
router.post("/lami/register", upload.single("frontIdimg"), async (req, res) => {    
  fs.readFile(req.files.selfie.path, function(err, data) {
    if(err) {
      console.log("Error in reading pic from disk");
  }else{
    fs.writeFile('newpic.jpg', data, 'binary', function(err) {
      if(err) {
          console.log("Error in writing pic to disk");
      }
  });
  }
  })
  const newUser = new registeredUsersDetails({
    frontIdimg: req.file.filename
  });
  try {
    const savedUsers = await newUser.save();
    // res.send("Registration Success");
    res.json(savedUsers);
  } catch (err) {
    res.json({ message: err });
  //  res.send("not uploaded");
  }
  
});
const singleUpload = upload.single('selfie');
router.post("/register/upload",singleUpload, async (req, res,next) => {  
  //res.send(req.file)

  try {
    const data= axios.post("https://api.cloudinary.com/v1_1/veriphy/image/upload/", FormData)
    
  } catch (err) {
   
  }
  
} );



//onboardong process users registration
router.post("/onboarding/register", async (req, res) => {  
  // const eamilExist = await onBoardingUsersDetails.findOne({
  //   email: req.body.email,
  // });
  // if (eamilExist) return res.send("Email already Exist");
  const newUser = new onBoardingUsersDetails({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    country: req.body.country,
  });
  try {
    const savedUsers = await newUser.save();
    // res.send("Registration Success");
    res.json(savedUsers);
  } catch (err) {
    res.json({ message: err });
  //  res.send("not uploaded");
  }
  
});         
//updating the onboardig database
router.patch("/onboarding/register/:id", async (req, res) => {  
  console.log('updating ')
  try {
    const updateRegister = await onBoardingUsersDetails.updateOne({
      _id: req.params.id}, {$set: {selfie:req.body.selfie}});
      res.json(updateRegister)
  } catch (err) {
    res.json({ message: err });
    console.log('not updated')
  //  res.send("not uploaded");
  }
  
});
router.patch("/onboarding/updatemanyregister/:id", async (req, res) => {  
  console.log('updating ')
  try {
    const updateRegister = await onBoardingUsersDetails.updateMany({
      _id: req.params.id}, {$set: {idNumber:req.body.idNumber,
        dochasProblem:req.body.dochasProblem,
        docidentity:req.body.docidentity,
        age:req.body.age,
        docExpired:req.body.docExpired, 
        dateOFBirth:req.body.dateOFBirth,  
        sex:req.body.sex,
        documentType: req.body.documentType,
        onWatchList:req.body.onWatchList,
        fullNamesFromMeta:req.body.fullNamesFromMeta,
        faceMatchScore:req.body.faceMatchScore,
        validationFrom:req.body.validationFrom,
        selfieURl:req.body.selfieURl,
        expirationDate:req.body.expirationDate,
        AlterationDetected:req.body.AlterationDetected, 
        pdfLink:req.body.pdfLink,
     
      }});
      res.json(updateRegister)
  } catch (err) {
    res.json({ message: err });
    console.log('not updated')
    console.log(err.message)
  //  res.send("not uploaded");
  }
  
});
//updating the onboardig database frontpage
router.patch("/onboarding/register/frontIdImg/:id", async (req, res) => {  
  try {
    const updateRegister = await onBoardingUsersDetails.updateOne({
      _id: req.params.id}, {$set: {frontIdimg:req.body.frontIdimg}});
      res.json(updateRegister)
  } catch (err) {
    res.json({ message: err });
    console.log('not updated')
    console.log(err)
  //  res.send("not uploaded");
  }
  
});

//updating the onboardig database backpage
router.patch("/onboarding/register/backIdImg/:id", async (req, res) => {  
  console.log('updating')
  try {
    const updateRegister = await onBoardingUsersDetails.updateOne({
      _id: req.params.id}, {$set: {backIdImg:req.body.backIdImg}});
      res.json(updateRegister)
  } catch (err) {
    res.json({ message: err });
    console.log('not updated')
  //  res.send("not uploaded");
  }
  
});
router.patch("/onboarding/register/selfie/:id", async (req, res) => {  
  //console.log('updating')
  try {
    const updateRegister = await onBoardingUsersDetails.updateOne({
      _id: req.params.id}, {$set: {selfie:req.body.selfie}});
      res.json(updateRegister)
  } catch (err) {
    res.json({ message: err });
    console.log('not updated')
  //  res.send("not uploaded");
  }
  
});
// get all the users from the database
//login link
router.post("/login", async (req, res) => {
  // console.log("called");
  //checking if the EMAIL EXIST
  const userExist = await registeredUsersDetails.findOne({
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
router.post("/login/specific", async (req, res) => {
  // console.log("called");
  //checking if the EMAIL EXIST
  const userExist = await onBoardingUsersDetails.findOne({
    email: req.body.email,
  });
  // console.log(userExist);

  res.send(userExist);
  // const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
  // res.header("auth-token-solo", token).send(token);
});

//find the exact user in crafrted/pages/profile/overview
router.get("/actualuser/specific/:id", async (req, res) => {
  // console.log("called");
  //checking if the EMAIL EXIST
  try{
    const userExist = await onBoardingUsersDetails.findById(req.params.id);
    res.send(userExist);
    console.log(userExist)
  }catch(err){
 res.json({message:err})
  }
  
  // console.log(userExist);

 
  // const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
  // res.header("auth-token-solo", token).send(token);
});

//for sending the email through gmail api
router.post("/register/sendemail", async (req, res) => {
  res.send("email senig route");
  // These id's and secrets should come from .env file.
  const CLIENT_ID =
    "454789142080-fll2qr9sj77btk32785iumnssbl23hns.apps.googleusercontent.com";
  const CLEINT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//04QRWhdxkGtDlCgYIARAAGAQSNwF-L9IrrnofRE2Of4r6XPe1ieg6hHgCKB5me3EXkNXjVQOd-cUo6Zwl3luK2m6dSlHgFubOv0g";

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "solomon@veriphy.co",
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: "Veriphy <info@veriphy.co>",
        to: req.body.email,
        subject: "Congratulations For Making your First Step",
        text: "Thank you for choosing Veriphy. A TRUST COMPANY",
        html: `
      
  
        <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title></title>
  <!--[if mso]>
  <style>
    table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    table, td, div, h1, p {
      font-family: Arial, sans-serif;
    }
    @media screen and (max-width: 530px) {
      .unsub {
        display: block;
        padding: 8px;
        margin-top: 14px;
        border-radius: 6px;
        background-color: #555555;
        text-decoration: none !important;
        font-weight: bold;
      }
      .col-lge {
        max-width: 100% !important;
      }
    }
    @media screen and (min-width: 531px) {
      .col-sml {
        max-width: 27% !important;
      }
      .col-lge {
        max-width: 73% !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
  <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
    <table role="presentation" style="width:100%;border:none;border-spacing:0;">
      <tr>
        <td align="center" style="padding:0;">
          <!--[if mso]>
          <table role="presentation" align="center" style="width:600px;">
          <tr>
          <td>
          <![endif]-->
          <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
            <tr>
              <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
               
              </td>
            </tr>
            
            <tr>
              <td style="padding:30px;background-color:#ffffff;">
                <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;"><h3>Hi,  ${req.body.firstName}   <a href="https://media.istockphotoverified-stamp-on-recycled-paper-picture-id1346917198?s=612x612" style="text-decoration:none;"><img src="https://i.postimg.cc/FRf4BZwn/logo.png" style="width:100px;height:100px;border:none;text-decoration:none;text-align:center; margin-left:20%"></a></h3></br>Congraturation on your Successsful Veriphy Registration!</h1>
                <p style="margin:0;"> Veriphy is a Pay-As-You-Go platform that enables a seamless experience in receiving your clients documents, verifying them against international and government databases and standards to give you instant confirmation to allow your team proceed with the transaction in seconds</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;">
                <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-2.png" width="600" alt="" style="width:100%;height:auto;display:block;border:none;text-decoration:none;color:#363636;"></a>
              </td>
            </tr>
            <tr>
              <td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                <!--[if mso]>
                <table role="presentation" width="100%">
                <tr>
                <td style="width:145px;" align="left" valign="top">
                <![endif]-->
                <div class="col-sml" style="display:inline-block;width:100%;max-width:145px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:14px;color:#363636;">
                  <img src="https://assets.codepen.io/210284/icon.png" width="115" alt="" style="width:115px;max-width:80%;margin-bottom:20px;">
                </div>
                <!--[if mso]>
                </td>
                <td style="width:395px;padding-bottom:20px;" valign="top">
                <![endif]-->
                <div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                  <p style="margin-top:0;margin-bottom:12px;">We decrease the time, to increase revenue. You have spent a lot of time and resources marketing to get your customers to your door, but you loose them due to slow and cumbersome on boarding processes designed to protect the very same business</p>
                  <p style="margin-top:0;margin-bottom:18px;"></p>
                  <p style="margin:0;"><a href="https://example.com/" style="background: #ff3884; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Learn More</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>
                </div>
                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <tr>
              <td style="padding:30px;font-size:24px;line-height:28px;font-weight:bold;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-1.png" width="540" alt="" style="width:100%;height:auto;border:none;text-decoration:none;color:#363636;"></a>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;background-color:#ffffff;">
                <p style="margin:0;"> If you have any questions, just reply to this email—we're always happy to help out</h5></p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">
                <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p>
                <p style="margin:0;font-size:14px;line-height:20px;">&reg; Veriphy, copyrights Reserved 2022<br></p>
              </td>
            </tr>
          </table>
          <!--[if mso]>
          </td>
          </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
     <h6>Best Regards</h6>
        <h6>Veriphy Limited</h6>     
        `,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

  sendMail()
    .then((result) => console.log("Email sent...", result))
    .catch((error) => console.log(error.message));
});
//for sending the email through gmail api
router.post("/login/sendemail", async (req, res) => {
  res.send("email senig route");
  // These id's and secrets should come from .env file.
  const CLIENT_ID =
    "454789142080-fll2qr9sj77btk32785iumnssbl23hns.apps.googleusercontent.com";
  const CLEINT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//04QRWhdxkGtDlCgYIARAAGAQSNwF-L9IrrnofRE2Of4r6XPe1ieg6hHgCKB5me3EXkNXjVQOd-cUo6Zwl3luK2m6dSlHgFubOv0g";

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "solomon@veriphy.co",
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: "Veriphy <info@veriphy.co>",
        to: req.body.email,
        subject: "Welcome to your User portal",
        text: "Thank you for choosing Veriphy. A TRUST COMPANY",
        html: `
      
  
        <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title></title>
  <!--[if mso]>
  <style>
    table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    table, td, div, h1, p {
      font-family: Arial, sans-serif;
    }////
    @media screen and (max-width: 530px) {
      .unsub {
        display: block;
        padding: 8px;
        margin-top: 14px;
        border-radius: 6px;
        background-color: #555555;
        text-decoration: none !important;
        font-weight: bold;
      }
      .col-lge {
        max-width: 100% !important;
      }
    }
    @media screen and (min-width: 531px) {
      .col-sml {
        max-width: 27% !important;
      }
      .col-lge {
        max-width: 73% !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
  <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
    <table role="presentation" style="width:100%;border:none;border-spacing:0;">
      <tr>
        <td align="center" style="padding:0;">
          <!--[if mso]>
          <table role="presentation" align="center" style="width:600px;">
          <tr>
          <td>
          <![endif]-->
          <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
            <tr>
              <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
               
              </td>
            </tr>
            
            <tr>
              <td style="padding:30px;background-color:#ffffff;">
                <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;"><h3>Hi,  ${req.body.firstName}   <a href="https://media.istockphoto.com/photos/wooden-verified-stamp-on-recycled-paper-picture-id1346917198?s=612x612" style="text-decoration:none;"><img src="https://i.postimg.cc/FRf4BZwn/logo.png" style="width:100px;heigth:100px;border:none;text-decoration:none;text-align:center; margin-left:20%;"></a></h3></br>Congraturation on your Successsful Veriphy Sign In!</h1>
                <p style="margin:0;">Veriphy is a Pay-As-You-Go platform that enables a seamless experience in receiving your clients documents, verifying them against international and government databases and standards to give you instant confirmation to allow your team proceed with the transaction in seconds.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;">
                <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-2.png" width="600" alt="" style="width:100%;height:auto;display:block;border:none;text-decoration:none;color:#363636;"></a>
              </td>
            </tr>
            <tr>
              <td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                <!--[if mso]>
                <table role="presentation" width="100%">
                <tr>
                <td style="width:145px;" align="left" valign="top">
                <![endif]-->
                <div class="col-sml" style="display:inline-block;width:100%;max-width:145px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:14px;color:#363636;">
                  <img src="https://assets.codepen.io/210284/icon.png" width="115" alt="" style="width:115px;max-width:80%;margin-bottom:20px;">
                </div>
                <!--[if mso]>
                </td>
                <td style="width:395px;padding-bottom:20px;" valign="top">
                <![endif]-->
                <div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                  <p style="margin-top:0;margin-bottom:12px;">We decrease the time, to increase revenue. You have spent a lot of time and resources marketing to get your customers to your door, but you loose them due to slow and cumbersome on boarding processes designed to protect the very same business</p>
                  <p style="margin-top:0;margin-bottom:18px;"></p>
                  <p style="margin:0;"><a href="https://example.com/" style="background: #ff3884; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Learn More</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>
                </div>
                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <tr>
              <td style="padding:30px;font-size:24px;line-height:28px;font-weight:bold;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                <a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-1.png" width="540" alt="" style="width:100%;height:auto;border:none;text-decoration:none;color:#363636;"></a>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;background-color:#ffffff;">
                <p style="margin:0;"> If you have any questions, just reply to this email—we're always happy to help out</h5></p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">
                <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p>
                <p style="margin:0;font-size:14px;line-height:20px;">&reg; Veriphy, copyrights Reserved 2022<br></p>
              </td>
            </tr>
          </table>
          <!--[if mso]>
          </td>
          </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
     <h6>Best Regards</h6>
        <h6>Veriphy Limited</h6>     
        `,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

  sendMail()
    .then((result) => console.log("Email sent...", result))
    .catch((error) => console.log(error.message));
});


router.post("/metamap/sendemail", async (req, res) => {
  res.send("email senig route");
  // These id's and secrets should come from .env file.
  const CLIENT_ID =
    "454789142080-fll2qr9sj77btk32785iumnssbl23hns.apps.googleusercontent.com";
  const CLEINT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//04QRWhdxkGtDlCgYIARAAGAQSNwF-L9IrrnofRE2Of4r6XPe1ieg6hHgCKB5me3EXkNXjVQOd-cUo6Zwl3luK2m6dSlHgFubOv0g";

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "solomon@veriphy.co",
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: "Veriphy <info@veriphy.co>",
        to: req.body.email,
        subject: "Analysis Feedback",
        text: "Thank you for choosing Veriphy. A TRUST COMPANY",
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <!--[if gte mso 15]>
          <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="date=no" />
          <meta name="format-detection" content="address=no" />
          <meta name="format-detection" content="telephone=no" />
          <title>VERIPHY</title>
          
        
          <style type="text/css" media="screen">
            /* Linked Styles */
            body { padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#ffffff; -webkit-text-size-adjust:none }
            a { color:#4bb182; text-decoration:none }
            p { padding:0 !important; margin:0 !important } 
            img { -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */ }
        
            /* Mobile styles */
            @media only screen and (max-device-width: 480px), only screen and (max-width: 480px) { 
              div[class='mobile-br-1'] { height: 1px !important; }
              div[class='mobile-br-1-b'] { height: 1px !important; background: #ffffff !important; display: block !important; }
              div[class='mobile-br-5'] { height: 5px !important; }
              div[class='mobile-br-10'] { height: 10px !important; }
              div[class='mobile-br-15'] { height: 15px !important; }
              div[class='mobile-br-20'] { height: 20px !important; }
              div[class='mobile-br-30'] { height: 30px !important; }
        
              th[class='m-td'], 
              td[class='m-td'], 
              div[class='hide-for-mobile'], 
              span[class='hide-for-mobile'] { display: none !important; width: 0 !important; height: 0 !important; font-size: 0 !important; line-height: 0 !important; min-height: 0 !important; }
        
              span[class='mobile-block'] { display: block !important; }
        
              div[class='img-m-center'] { text-align: center !important; }
              div[class='h2-white-m-center'],
              div[class='text-white-m-center'],
              div[class='text-white-r-m-center'],
              div[class='h2-m-center'],
              div[class='text-m-center'],
              div[class='text-r-m-center'],
              td[class='text-top'],
              div[class='text-top'],
              div[class='h6-m-center'],
              div[class='text-m-center'],
              div[class='text-top-date'],
              div[class='text-white-top'],
              td[class='text-white-top'],
              td[class='text-white-top-r'],
              div[class='text-white-top-r'] { text-align: center !important; }
        
              div[class='fluid-img'] img,
              td[class='fluid-img'] img { width: 100% !important; max-width: 100% !important; height: auto !important; }
        
              table[class='mobile-shell'] { width: 100% !important; min-width: 100% !important; }
              table[class='center'] { margin: 0 auto; }
        
              th[class='column-rtl'],
              th[class='column-rtl2'],
              th[class='column-top'],
              th[class='column'] { float: left !important; width: 100% !important; display: block !important; }
        
              td[class='td'] { width: 100% !important; min-width: 100% !important; }
        
              td[class='content-spacing'] { width: 15px !important; }
              td[class='content-spacing2'] { width: 10px !important; }
            } 
          </style>
        </head>
        <body class="body" style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#ffffff; -webkit-text-size-adjust:none">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
            <tr>
              <td align="center" valign="top">
                <!-- 3/ Header -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4bb182">
                  <tr>
                    <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                    <td align="center">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="20" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="20" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                      <table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                        <tr>
                          <td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0">
                            <!-- Top Bar -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4bb182">
                              <tr>
                                <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                                <td>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <!-- Column -->
                                      <th class="column" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0" width="300">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="text-white-top" style="color:#ffffff; font-family:Arial,sans-serif; font-size:11px; line-height:15px; text-align:left; text-transform:uppercase">
                                              <a href="#" target="_blank" class="link-white-u" style="color:#ffffff; text-decoration:underline"><span class="link-white-u" style="color:#ffffff; text-decoration:underline"></span></a> &nbsp; <a href="#" target="_blank" class="link-white-u" style="color:#ffffff; text-decoration:underline"><span class="link-white-u" style="color:#ffffff; text-decoration:underline"></span></a>
                                              <div style="font-size:0pt; line-height:0pt;" class="mobile-br-20"></div>
        
                                            </td>
                                          </tr>
                                        </table>
                                      </th>
                                      <!-- END Column -->
                                      <!-- Column -->
                                      <th class="column" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td align="right">
                                              <!-- Socails -->
                                              <table class="center" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                  <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="38"><a href="#" target="_blank"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617117/footer_ico_facebook_fwhl1i.jpg" border="0" width="13" height="13" alt="" /></a></td>
                                                  <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="38"><a href="#" target="_blank"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617171/ico_twitter_i5qleq.jpg" border="0" width="13" height="13" alt="" /></a></td>
                                                  <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="38"><a href="#" target="_blank"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617223/ico2_gplus_aeepds.jpg" border="0" width="13" height="13" alt="" /></a></td>
                                                  <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="38"><a href="#" target="_blank"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617245/ico_pinterest_lscbhp.jpg" border="0" width="13" height="13" alt="" /></a></td>
                                                  <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="13"><a href="#" target="_blank"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617276/ico_instagram_ppz4l2.jpg" border="0" width="13" height="13" alt="" /></a></td>
                                                </tr>
                                              </table>
                                              <!-- END Socails -->
                                            </td>
                                          </tr>
                                        </table>
                                      </th>
                                      <!-- END Column -->
                                    </tr>
                                  </table>
                                </td>
                                <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                              </tr>
                            </table>
                            <!-- END Top Bar -->
                          
                            <!-- Header -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                                <td>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="30" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                  <div class="hide-for-mobile">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="10" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                  </div>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <!-- Column -->
                                      <th class="column" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0" width="300">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td>Veriphy Feedback
                                              <div class="img" style="font-size:0pt; line-height:0pt; text-align:left"><div class="img-m-center" style="font-size:0pt; line-height:0pt"><a href="#" target="_blank"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657548323/logonb_s84l0f.png" border="0" width="190" height="48" alt="" /></a></div></div>
                                              <div style="font-size:0pt; line-height:0pt;" class="mobile-br-20"></div>
        
                                            </td>
                                          </tr>
                                        </table>
                                      </th>
                                      <!-- END Column -->
                                      <!-- Column -->
                                      <th class="column" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td align="right" class="text-white-top-r" style="color:#ffffff; font-family:Arial,sans-serif; font-size:11px; line-height:15px; text-align:right; text-transform:uppercase">
                                            </td>
                                          </tr>
                                        </table>
                                      </th>
                                      <!-- END Column -->
                                    </tr>
                                  </table>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="40" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                </td>
                                <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                              </tr>
                            </table>
                            <!-- END Header -->
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                    <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                  </tr>
                </table>
                <!-- END 3/ Header -->
                
                <!-- Section 1 -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e6e6e6">
                  <tr>
                    <td valign="top" class="m-td" style="font-size:0pt; line-height:0pt; text-align:left"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4bb182" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td bgcolor="#4bb182" height="190" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </td>
                    <td valign="top" class="m-td" style="font-size:0pt; line-height:0pt; text-align:left" width="1"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4bb182" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td bgcolor="#4bb182" height="190" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </td>
                    <td width="650" align="center">
                      <table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell" bgcolor="#f6f6f6">
                        <tr>
                          <td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="10"></td>
                                <td>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="10" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                  <div class="fluid-img" style="font-size:0pt; line-height:0pt; text-align:left"><div class="img-center" style="font-size:0pt; line-height:0pt; text-align:center"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657548323/logonb_s84l0f.png" border="0" width="630" height="360" alt="" /></div></div>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="10" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                </td>
                                <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="10"></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table  width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                        <tr>
                          <td>
                            <div class="fluid-img" style="font-size:0pt; line-height:0pt; text-align:left"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657616975/hero_shadow_zyrqxu.jpg" border="0" width="650" height="22" alt="" /></div>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e6e6e6">
                              <tr>
                                <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="30"></td>
                                <td>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="20" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                  <div class="h3-grey-center" style="color:#666666; font-family:Arial,sans-serif; font-size:26px; line-height:34px; text-align:center">Below is a collection summary of gathered datails <span class="hide-for-mobile"><br /></span></div>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="20" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                          
                                  <div class="text-grey-center" style="color:#777777; font-family:Arial,sans-serif; font-size:14px; line-height:20px; text-align:center"> <span class="hide-for-mobile"><br /></span>Document status ${req.body.docidentity}</div>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="30" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                </td>
                                <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="30"></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="m-td" style="font-size:0pt; line-height:0pt; text-align:left" valign="top" width="1"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4bb182" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td bgcolor="#4bb182" height="190" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </td>
                    <td valign="top"  class="m-td" style="font-size:0pt; line-height:0pt; text-align:left"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#4bb182" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td bgcolor="#4bb182" height="190" class="border" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </td>
                  </tr>
                </table>
                <!-- END Section 1 -->
        
                <!-- Section 2 -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e6e6e6">
                  <tr>
                    <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                    <td align="center">
                      <table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell" bgcolor="#e6e6e6">
                        <tr>
                          <td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="32" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                            <div class="hide-for-mobile"><div class="img-center" style="font-size:0pt; line-height:0pt; text-align:center"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617024/graphic_ellipse_vw6pfi.jpg" border="0" width="14" height="14" alt="" /></div></div>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="direction: rtl" dir="rtl">
                              <tr>
                                <!-- Column -->
                                <th class="column-rtl" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; direction:ltr; Margin:0" dir="ltr" width="325">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td>
                                        <div class="hide-for-mobile">
                                          <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="60" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                        </div>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="m-td" style="font-size:0pt; line-height:0pt; text-align:left" width="148"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617068/graphic_right_ai9rux.jpg" border="0" width="110" height="7" alt="" /></td>
                                            <td class="img" style="font-size:0pt; line-height:0pt; text-align:left"><div class="img-m-center" style="font-size:0pt; line-height:0pt"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657548883/graphic_image1_wjkf8u.jpg" border="0" width="101" height="99" alt="" /></div></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </th>
                                <!-- END Column -->
                                <!-- Column -->
                                <th class="column" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0" width="1" bgcolor="#b2b2b2"></th>
                                <!-- END Column -->
                                <!-- Column -->
                                <th class="column-rtl" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; direction:ltr; Margin:0" dir="ltr" width="324">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td>
                                        <div class="hide-for-mobile"><table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="40" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </div>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="20" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="30"></td>
                                            <td>
                                              <div class="h6-m-center" style="color:#777777; font-family:Arial,sans-serif; font-size:16px; line-height:22px; text-align:left; font-weight:bold">Full names:${req.body.fullNamesFromMeta} </div>
                                              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="4" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                              <div class="text-m-center" style="color:#777777; font-family:Arial,sans-serif; font-size:12px; line-height:20px; text-align:left">ID: NUMBER ${req.body.idNumber}</div>
                                            </td>
                                            <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="58"></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </th>
                                <!-- END Column -->
                              </tr>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <!-- Column -->
                                <th class="column-top" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; Margin:0" dir="ltr" width="324">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="60" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
          
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="img-right" style="font-size:0pt; line-height:0pt; text-align:right"><div class="img-m-center" style="font-size:0pt; line-height:0pt"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657548959/graphic_image2_asbpqv.jpg" border="0" width="121" height="99" alt="folder" /></div></td>
                                            <td class="m-td" style="font-size:0pt; line-height:0pt; text-align:left" width="148"><div class="img-right" style="font-size:0pt; line-height:0pt; text-align:right"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657549200/graphic_left_tniyoj.jpg" border="0" width="110" height="7" alt="" /></div></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </th>
                                <!-- END Column -->
                                <!-- Column -->
                                <th class="m-td" style="font-size:0pt; line-height:0pt; text-align:left" width="1" bgcolor="#b2b2b2"></th>
                                <!-- END Column -->
                                <!-- Column -->
                                <th class="column-top" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; Margin:0" width="325">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td>
                                        <div class="hide-for-mobile"><table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="40" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </div>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="20" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="58"></td>
                                            <td>
                                              <div class="h6-m-center" style="color:#777777; font-family:Arial,sans-serif; font-size:16px; line-height:22px; text-align:left; font-weight:bold">Ducument Type</div>
                                              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="4" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                              <div class="text-m-center" style="color:#777777; font-family:Arial,sans-serif; font-size:12px; line-height:20px; text-align:left">${req.body.documentType}</div>
                                            </td>
                                            <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="30"></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </th>
                                <!-- END Column -->
                              </tr>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="direction: rtl" dir="rtl">
                              <tr>
                                <!-- Column -->
                                <th class="column-rtl" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; direction:ltr; Margin:0" dir="ltr" width="325">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="60" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="m-td" style="font-size:0pt; line-height:0pt; text-align:left" width="148"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657549128/graphic_right_wwxc7n.jpg" border="0" width="110" height="7" alt="" /></td>
                                            <td class="img" style="font-size:0pt; line-height:0pt; text-align:left"><div class="img-m-center" style="font-size:0pt; line-height:0pt"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657548883/graphic_image1_wjkf8u.jpg" border="0" width="114" height="105" alt="" /></div></td>
                                          </tr>
                                        </table>
                                        <div class="hide-for-mobile"><table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="40" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </th>
                                <!-- END Column -->
                                <!-- Column -->
                                <th class="m-td" style="font-size:0pt; line-height:0pt; text-align:left" width="1" bgcolor="#b2b2b2"></th>
                                <!-- END Column -->
                                <!-- Column -->
                                <th class="column-rtl" style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top; direction:ltr; Margin:0" dir="ltr" width="324">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="20" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                        <div class="hide-for-mobile"><table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="40" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        </div>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="30"></td>
                                            <td>
                                              <div class="h6-m-center" style="color:#777777; font-family:Arial,sans-serif; font-size:16px; line-height:22px; text-align:left; font-weight:bold">Date of Birth</div>
                                              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="4" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                              <div class="text-m-center" style="color:#777777; font-family:Arial,sans-serif; font-size:12px; line-height:20px; text-align:left">${req.body.dateOFBirth}</div>
                                              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="40" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                            </td>
                                            <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="58"></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </th>
                                <!-- END Column -->
                              </tr>
                            </table>
                            <div class="hide-for-mobile">
                              <div class="img-center" style="font-size:0pt; line-height:0pt; text-align:center"><img src="https://res.cloudinary.com/veriphy/image/upload/v1657617024/graphic_ellipse_vw6pfi.jpg" border="0" width="14" height="14" alt="" /></div>
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="40" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                            </div>
                            <!-- Button -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td align="center">
                                  <table border="0" cellspacing="0" cellpadding="0" bgcolor="#4bb182" style="border-radius: 2px;">
                                    <tr>
                                      <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="18"></td>
                                      <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="10" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                        <div class="text-button" style="color:#ffffff; font-family:Arial,sans-serif; font-size:14px; line-height:18px; text-align:center; text-transform:uppercase"><a href="#" target="_blank" class="link-white" style="color:#ffffff; text-decoration:none"><span class="link-white" style="color:#ffffff; text-decoration:none">On watchList :  ${req.body.onWatchList}</span></a></div>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="10" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                                      </td>
                                      <td class="img" style="font-size:0pt; line-height:0pt; text-align:left" width="18"></td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!-- END Button -->
                          
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%"><tr><td height="50" class="spacer" style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%">&nbsp;</td></tr></table>
        
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="content-spacing" style="font-size:0pt; line-height:0pt; text-align:left" width="1"></td>
                  </tr>
                </table>
                <!-- END Section 2 -->
        
                <!-- Section 3 -->
                
                <!-- END Section 3 -->
        
                <!-- Section 4 -->
              
                <!-- END Section 4 -->
        
                <!-- Section 5 -->
              
                <!-- END Section 5 -->
        
                <!-- Section 6 -->
              
        
                <!-- END Section 6 -->
            
                <!-- Footer -->
              
                <!-- END Footer -->
              </td>
            </tr>
          </table>
        </body>
        </html>
       
            
        `,
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

  sendMail()
    .then((result) => console.log("Email sent...", result))
    .catch((error) => console.log(error.message));
});


export default router;
   