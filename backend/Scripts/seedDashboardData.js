import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../models/UsersModel.js";
import { ProjectModel } from "../models/ProjectModel.js";
import { EventModel } from "../models/EventModel.js";


dotenv.config();

await mongoose.connect(process.env.MONGOOSE_URL);

// 1. Get any user
const user = await UserModel.findOne(); 
if (!user) throw new Error("No users found");

// 2. Create 2 dummy projects
const project1 = await ProjectModel.create({ name: "SaaS App", user: user._id ,apiKey: generateApiKey(),});
const project2 = await ProjectModel.create({ name: "Blog App", user: user._id ,apiKey: generateApiKey(),});

// 3. Fake Events
const pages = ["/", "/pricing", "/blog", "/contact"];
const eventTypes = ["page_view", "click", "signup", "scroll"];

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateApiKey() {
    return Math.random().toString(36).substring(2, 15);
  }
  

function createFakeEvent(projectId) {
  return {
    project: projectId,
    eventType: getRandomFromArray(eventTypes),
    url: getRandomFromArray(pages),
    referrer: "https://google.com",
    userAgent: "Mozilla/5.0",
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7), // last 7 days
    metadata: { info: "testing123" },
  };
}

const fakeEvents = [];
for (let i = 0; i < 50; i++) {
  fakeEvents.push(createFakeEvent(Math.random() > 0.5 ? project1._id : project2._id));
}

await EventModel.insertMany(fakeEvents);
console.log("✅ Seeded 50 fake events across 2 projects.");
process.exit();
