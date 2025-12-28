import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/mongodb.js';
import clerkWebhook from './controllers/webhook.js';

const app = express();
dotenv.config();
connectDB();

app.use(cors());

app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);

app.use(bodyParser.json());

app.use('/', (req, res) => {
    res.send("API is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
