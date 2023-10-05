import { EventModel } from "../Models/EventModel.js";
import * as fs from 'fs';

const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find()
      .populate("organizedBy", "full_name")
      .populate("attendees", "full_name")
      .populate("category", {})
      .exec();
    if (events.length === 0) {
      res.status(200).json({ message: "No events found.", events });
    } else {
      res.status(200).json({ events });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
};

const eventDetails = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const events = await EventModel.findById(eventId)
      .populate("organizedBy", "full_name")
      .populate("attendees", "full_name")
      .populate("category", {})
      .exec();
    if (events.length === 0) {
      res.status(200).json({ message: "No events found.", events });
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching event data." });
  }
};

const eventsToday = async (req, res) => {
  try {
    const { currentDate } = req.body;
    const selectedDate = new Date(currentDate);
    const events = await EventModel.find({
      $and: [
        {
          startDate: { $lte: selectedDate },
          EndDate: { $gte: selectedDate },
        },
      ],
    })
      .populate("organizedBy", "full_name")
      .populate("attendees", "full_name")
      .populate("category", {})
      .exec();
    if (events.length === 0) {
      res.status(200).json({ message: "No events found for today.", events });
    } else {
      res.status(200).json({ events });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching event data." });
  }
};
//past events with search and filter by category
const pastEvents = async (req, res) => {
  const searchTerm = req.query.search;
  const categoryFilter = req.query.category;
  const currentDate=  new Date().setHours(0, 0, 0, 0)

  const query = {
    EndDate: { $lt: currentDate },
  };

  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }

  if (categoryFilter) {
    query.category = { $regex: categoryFilter, $options: "i" };
  }

  try {
    const pastEvents = await EventModel.find(query)
      .populate("organizedBy", "full_name")
      .populate("attendees", "full_name")
      .populate("category", {})
      .exec();

    if (pastEvents.length === 0) {
      res.status(200).json({ message: "No past events found.", pastEvents });
    } else {
      res.status(200).json({ pastEvents });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching past events." });
  }
};
//upcoming events with search and filter by category
const upcomingEvents = async (req, res) => {
  const searchTerm = req.query.search;
  const categoryFilter = req.query.category;
  const currentDate=  new Date().setHours(0, 0, 0, 0)

  const query = {
    EndDate: { $gte: currentDate },
  };

  if (searchTerm) {
    query.title = { $regex: searchTerm, $options: "i" };
  }

  if (categoryFilter) {
    query.category = { $regex: categoryFilter, $options: "i" };
  }
  try {
    const upcomingEvents = await EventModel.find(query)
      .populate("organizedBy", "full_name")
      .populate("attendees", "full_name")
      .populate("category", {})
      .exec();

    if (upcomingEvents.length === 0) {
      res
        .status(200)
        .json({ message: "No upcoming events found.", upcomingEvents });
    } else {
      res.status(200).json({ upcomingEvents });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching upcoming events." });
  }
};

const myEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const myEvents = await EventModel.find({ organizedBy: userId })
      .populate("organizedBy", "full_name")
      .populate("attendees", "full_name")
      .populate("category", {})
      .exec();

    if (myEvents.length === 0) {
      res.status(200).json({ message: "No personal events found.", myEvents });
    } else {
      res.status(200).json({ myEvents });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching past events." });
  }
};

const EventCount = async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await EventModel.find({
      $and: [
        {
          startDate: { $lte: currentDate },
          EndDate: { $gte: currentDate },
        },
      ],
    });
    const pastEvents = await EventModel.find({ EndDate: { $lt: currentDate } });
    const upcomingEvents = await EventModel.find({
      startDate: { $gte: currentDate },
    });

    res.status(200).json({
      totalEvents: events.length,
      pastEventCount: pastEvents.length,
      upcomingEventCount: upcomingEvents.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching  event count." });
  }
};

const addEvent = async (req, res) => {
  const {
    title,
    location,
    category,
    startDate,
    EndDate,
    StartTime,
    EndTime,
    description,
    attendees,
    organizedBy,
  } = req.body;
  const fileDetails = {filepath:req.file.path,name:req.file.originalname};
  let filePath;

  const events = new EventModel({
    title,
    location,
    category,
    startDate,
    EndDate,
    StartTime,
    EndTime,
    description,
    attendees:attendees ? attendees : [],
    organizedBy,
    event_photos:fileDetails,
  });
  try {
    await events.save();
    res.status(200).json({ message: "Event added succesfully" });
  } catch (error) {
    if (req.file) {
      filePath = req.file.path;

      // Attempt to delete the file
      try {
        fs.unlinkSync(filePath);
        console.log(`File ${filePath} deleted successfully.`);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }
    res.json(error);
    console.error("Error creating event:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the event." });
  }
};

const editEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const {
      title,
      location,
      category,
      startDate,
      EndDate,
      StartTime,
      EndTime,
      description,
      attendees
    } = req.body;
    const fileDetails = {filepath:req.file.path,name:req.file.originalname};
    await EventModel.findByIdAndUpdate(eventId, {
      title,
      location,
      category,
      startDate,
      EndDate,
      StartTime,
      EndTime,
      description,
      attendees:attendees ? attendees : [],
      event_photos:fileDetails,

    });

    res.status(200).json({ message: "Event edited successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while editing the event." });
  }
};

const addAttendees = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { attendees } = req.body;
    await EventModel.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: { $each: attendees } } },
      { new: true }
    );
    res.status(200).json({ message: "Attendees added successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding attendees." });
  }
};
const removeAttendees = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { attendees } = req.body;
    await EventModel.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: { $in: attendees } } },
      { new: true }
    );
    res.status(200).json({ message: "Attendees removed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while removing attendees." });
  }
};

export {
  addEvent,
  eventDetails,
  eventsToday,
  getAllEvents,
  pastEvents,
  upcomingEvents,
  myEvents,
  editEvent,
  EventCount,
  addAttendees,
  removeAttendees,
};
