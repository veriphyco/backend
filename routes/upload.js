import multer from "multer";
import GridFsStorage  from 'multer-gridfs-storage';

const storage = new GridFsStorage({
    url: process.env.DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
  
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }
  
        return {
            bucketName: "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
  });

  module.exports = multer({ storage });



  router.post("/register/upload",singleUpload, async (req, res,next) => {  
    //res.send(req.file)
  
    try {
      const file = req.file;
    //  console.log(req.file)
     // console.log(req.body)
      if (!file) {
        const error = new Error("Please uplod a file");
        error.httpStatusCode = 400;
        return next(error);
      }
      const send = file.filename
      const url = req.protocol + ':\\' + req.get('host')
      const newUser = new registeredUsersUploads({
        selfie: `/media/serverUploads/${send}`,
      
      })
      const savedUsers = await newUser.save();
      // res.send("Registration Success");
      res.json(savedUsers);
      //res.send(selfie)
    } catch (err) {
      res.json({ message: err });
      res.send("Error on Sending Image")
    //  res.send("not uploaded");    
    }
    
  } );