import express from "express";
import {profilePictureUpload} from "../Utils/Upload.js";
import { Register,Login,editProfile ,getAllusers} from "../Controllers/AuthController.js";

const router= express.Router()
router.post("/signup",profilePictureUpload.single('profile_picture'),Register);
router.post("/login", Login);
router.put("/edit/:userId",profilePictureUpload.single('profile_picture'), editProfile);
router.get("/users",getAllusers)

export {router as userRouter}