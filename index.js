import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import { userRouter } from "./Routes/AuthRoute.js";
import { birthdayRouter } from "./Routes/upcomingbirthdayRoute.js";
import { eventRouter } from "./Routes/EventRoute.js";
import { categoryRouter } from "./Routes/CategoryRoute.js";

dotenv.config();
const app = express();

const { MONGO_URL, PORT } = process.env;

app.use("/Uploads", express.static("Uploads"));
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port`);
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/auth", userRouter);
app.use("/events", eventRouter);
app.use("/birthdays", birthdayRouter);
app.use("/categories", categoryRouter);
app.use((err, req, res, next) => {
  console.log(err)
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: 'File upload error: ' + err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

