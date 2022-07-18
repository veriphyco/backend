import express from "express";
import dotenv from "dotenv";
import uSerRouter from "./routes/userRoutes.js";
import apiRouter from "./routes/apis.js";
import AdminRouter from "./routes/adminRegisterRoute.js";
import DarajaRouter from './routes/daraja.js'
import MetamapRouter from './routes/metamap.js'
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import Grid from 'gridfs-stream';
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
//import uSerRouter from "./userRoutes";
//initialize the express app
const app = express();
app.use(cors());


// app.enable('trust proxy');
// app.use(function (req, res, next) {
//   if (req.secure) {
//     next();
//   } else {
//     res.redirect('https://' + req.headers.host + req.url);
//   }
// });

//initialize dotenv config for storing environmtal variables


// app.get("/", async (req, res) => {
//   console.log("users route");
//   res.send("user route");
// });

// app.enable('trust proxy');
// app.use(function (req, res, next) {
//   if (req.secure) {
//     next();
//   } else {
//     res.redirect('https://' + req.headers.host + req.url);
//   }
// });


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//body parser middleware to parse json output to the browser/console
app.use(bodyParser.json());


// a middleware that runs everytime the user hits the users route;
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./client/public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, uuidv4() + '-' + fileName)
//   },
// });

//const upload = multer();
app.use("/users",uSerRouter);
app.use("/api", apiRouter);
app.use("/admin", AdminRouter);
app.use("/daraja", DarajaRouter);
app.use("/metamap", MetamapRouter);
// app.use(multer({
//   storage:storage
//   }).single('selfie'));

//app.use(express.static("/uploads", "uploads"));
//database connection start
const connectionLink2 =
  "mongodb+srv://solomon:solo0702591509@cluster0.cvqeg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(  
  process.env.MONGODB_URI || connectionLink2,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connectionn was successful");
  }
);

mongoose.connection.on("connected", () => {    
  console.log("Connection confirmed");  
});
//cheking to see if you are really connected to the database;
mongoose.connection
  .once("open", () => {
    console.log("Connected Connected Connected!!");   
  
  })
  .on("error", (error) => {
    console.log(`connection error: ${error}`);            
  });


//database connection end

//HEROKU SETTINGS FOR ENVIRONEMT VARIABLES START
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
//HEROKU SETTINGS FOR ENVIRONEMT VARIABLES START END

// removin the # in my react start
// app.use(express.static(__dirname + "/client/public"));
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
// });

// removin the # in my react start
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server started successsfully on porttt 5000!!!!!!!!");
});
