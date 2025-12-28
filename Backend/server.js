import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/mongodb.js';
import clerkWebhook from './controllers/webhook.js';

const app = express();
dotenv.config();
connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use('/', (req, res) => {
    res.send("API is working");
});
app.post('/clerk', express.json(), clerkWebhook);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
