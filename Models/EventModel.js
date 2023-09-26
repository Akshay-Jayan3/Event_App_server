import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  location: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    // required: [true, "Organizer is required"],
  },
  startDate: {
    type: Date,
    index: true,
  },
  EndDate: {
    type: Date,
    index: true,
  },
  StartTime: {
    type: String,
    // required: [true, "Start time is required"],
  },
  EndTime: {
    type: String,
  },
  description: {
    type: String,
    // required: [true, "Description is required"],
  },
  event_photos: [{ type: String }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  organizedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    // required: [true, "Organizer is required"],
  },
});

export const EventModel = mongoose.model("events", eventSchema);
