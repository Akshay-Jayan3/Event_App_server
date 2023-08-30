import express from "express";
import { getAllcategories } from "../Controllers/categoryController.js";

const router = express.Router()

router.get("/",getAllcategories)

export {router as categoryRouter};