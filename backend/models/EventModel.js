import mongoose from "mongoose";

const EventSchmea = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  eventType: String,
  url: String,
  referrer: String,
  userAgent: String,
  timestamp: Date,
  metadata: Object,
  visitorId: String
})

export const EventModel = mongoose.model('Event',EventSchmea)
