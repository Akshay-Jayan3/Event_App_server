import express from "express";
import { VerifyToken } from "../Middlewares/authentication.js";
import {eventPhotoUpload} from "../Utils/Upload.js";
import {
  addEvent,
  getAllEvents,
  pastEvents,
  upcomingEvents,
  myEvents,
  editEvent,
  EventCount,
  addAttendees,
  removeAttendees,
  eventDetails,
  eventsToday,
} from "../Controllers/EventController.js";
const router = express.Router();

router.get("/", VerifyToken, getAllEvents);
router.get("/eventDetails/:eventId", eventDetails);
router.get("/pastEvents", pastEvents);
router.get("/upcomingEvents", upcomingEvents);
router.get("/myEvents/:userId", myEvents);
router.get("/count", EventCount);
router.get("/today", eventsToday);
router.post("/create",eventPhotoUpload.array('event_photos'), addEvent);
router.put("/update/:eventId", editEvent);
router.put("/addattendees/:eventId", addAttendees);
router.put("/removeattendees/:eventId", removeAttendees);

export { router as eventRouter };
