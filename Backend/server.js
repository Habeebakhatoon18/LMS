import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/mongodb.js';
import clerkWebhook from './controllers/webhook.js';
import { clerkMiddleware } from '@clerk/express';
import EducatorRouter from './routes/educator.js';
import connectCloudinary from './config/cloudinary.js';
import CourseRouter from './routes/courses.js';
import UserRouter from './routes/user.js';

const app = express();
dotenv.config();
connectDB();
await connectCloudinary();

// Allow the frontend to send Clerk session cookies. Set `CLIENT_URL` in your .env
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(clerkMiddleware());
app.use(bodyParser.json());

app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);



app.use('/educator', EducatorRouter)
app.use('/courses', CourseRouter);
app.use('/user', UserRouter);
app.use('/', (req, res) => {
    res.send("API is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
