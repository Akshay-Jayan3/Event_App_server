import express from "express";
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
  eventsBycategory,
  eventsToday
} from "../Controllers/EventController.js";
const router = express.Router();

router.get("/", getAllEvents);
router.get("/eventDetails/:eventId", eventDetails);
router.get("/Category/:category", eventsBycategory);
router.get("/pastEvents", pastEvents);
router.get("/upcomingEvents", upcomingEvents);
router.get("/myEvents/:userId", myEvents);
router.get("/count", EventCount);
router.get("/today", eventsToday);
router.post("/create", addEvent);
router.put("/update/:eventId", editEvent);
router.put("/addattendees/:eventId", addAttendees);
router.put("/removeattendees/:eventId", removeAttendees);

export { router as eventRouter };
