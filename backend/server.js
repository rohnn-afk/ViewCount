import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { mongooseConnect } from './config/Mongoose.js';
import { userRouter } from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { projectRouter } from './routes/ProjectRoute.js';
import { AnalyticsRouter } from './routes/AnalyticsRoute.js';
import { receiveEvent } from './controller/EventsController.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------
// GLOBAL Middleware
app.use(express.json());
app.use(cookieParser());

// ----------------------------------
// CORS SETTINGS

// For your frontend (with cookies)
const frontendOrigin =  [
  'https://viewcount-frontend.onrender.com',
  'http://localhost:5173',
];

// CORS for SDK requests from any origin
const sdkCors = cors({
  origin: '*',
});

// CORS for secure user routes
const frontendCors = cors({
  origin: frontendOrigin,
  credentials: true,
});

// ----------------------------------
// Routes

// SDK file publicly served
app.get('/analytics.js', sdkCors, (req, res) => {
  res.sendFile(path.join(__dirname, 'analytics.js'));
});

// Public event route — allow CORS from anywhere
app.options('/api/event', sdkCors); // Allow preflight
app.post('/api/event', sdkCors, receiveEvent);

// Secure routes (frontend only)
app.use('/api/user', frontendCors, userRouter);
app.use('/api/project', frontendCors, projectRouter);
app.use('/api/analytics', frontendCors, AnalyticsRouter);

// Test route
app.get('/', (req, res) => {
  res.json('working');
});

// ----------------------------------
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on : ${PORT}`);
  mongooseConnect();
});
