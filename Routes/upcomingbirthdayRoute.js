import express from "express";
import { upcomingBirthdays } from "../Controllers/upcomingbirthdayController.js";
const router= express.Router()

router.get("/", upcomingBirthdays);


export {router as birthdayRouter}