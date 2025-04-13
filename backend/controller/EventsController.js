// controllers/eventController.js
import { EventModel } from '../models/EventModel.js';
import { ProjectModel } from '../models/ProjectModel.js';

export const receiveEvent = async (req, res) => {
  try {
    const { eventType, metadata, apiKey } = req.body;

    if (!eventType || !metadata || !apiKey) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 🔐 Validate API Key
    const project = await ProjectModel.findOne({ apiKey });

    if (!project) {
      return res.status(403).json({ message: 'Invalid API key' });
    }

    // ✅ Destructure core metadata
    const { url, referrer, userAgent, timestamp, visitorId, ...restMetadata } = metadata;

    // ✅ Add visitorId to project if it's new
    if (visitorId && !project.uniqueVisitors.includes(visitorId)) {
      project.uniqueVisitors.push(visitorId);
      await project.save();
    }

    const event = new EventModel({
      project: project._id,
      eventType,
      url,
      referrer,
      userAgent,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      metadata: restMetadata,
      visitorId
    });

    await event.save();

    res.status(201).json({ message: 'Event stored successfully' });
  } catch (err) {
    console.error('[Event Controller Error]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const ResetEvents = async (req, res) => {
  try {
    const { projectid } = req.body;

    if (!projectid) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    // Delete events with matching project ID
    const result = await EventModel.deleteMany({ project: projectid });

    const updateResult = await ProjectModel.findByIdAndUpdate(
      projectid,
      { $set: { uniqueVisitors: [] } },
      { new: true }
    );

    return res.status(200).json({success:true,
      message: `Deleted ${result.deletedCount} events for project ${projectid}`,
    });
  } catch (error) {
    console.error('Error deleting events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};