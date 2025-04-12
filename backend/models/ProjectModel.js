import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: String,
    url: String,
    apiKey: { type: String, unique: true },
    uniqueVisitors: [{ type: String }], // Array of IPs or identifiers
    createdAt: { type: Date, default: Date.now }
});

export const ProjectModel = mongoose.model('Project', ProjectSchema);
