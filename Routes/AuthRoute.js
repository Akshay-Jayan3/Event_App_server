import express from "express";
import multer from 'multer';
import path from 'path';
import { Register,Login,editProfile ,getAllusers} from "../Controllers/AuthController.js";


const router= express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Uploads/profile_pictures'); // Upload destination directory
    },
    filename: function (req, file, cb) {
      const extname = path.extname(file.originalname);
      const filename = `${Date.now()}${extname}`;
      cb(null, filename);
    },
  });
const upload = multer({ storage });

router.post("/signup", Register);
router.post("/login", Login);
router.put("/edit/:userId",upload.single('profilePicture'), editProfile);
router.get("/users",getAllusers)

export {router as userRouter}