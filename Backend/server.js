import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import { clerkMiddleware } from '@clerk/express';
import EducatorRouter from './routes/educator.js';
import {clerkWebhook, stripeWebhook} from './controllers/webhook.js';
import connectCloudinary from './config/cloudinary.js';
import CourseRouter from './routes/courses.js';
import UserRouter from './routes/user.js';

const app = express();
dotenv.config();
connectDB();
await connectCloudinary();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(clerkMiddleware());

app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);

app.use('/educator', express.json(), EducatorRouter)
app.use('/courses',express.json(),  CourseRouter);
app.use('/user',express.json(),  UserRouter);
app.post('/stripe',express.raw({type: 'application/json'}),stripeWebhook);
app.use('/', (req, res) => {
    res.send("API is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
