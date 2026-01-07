import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/lms";

    if (!process.env.MONGODB_URI) {
        console.warn("Warning: MONGODB_URI not set; using default local URI");
    } 
        // Mask credentials when logging the URI for debugging
        //let safeUri = mongoUri;
        //  safeUri = mongoUri.includes('@') ? mongoUri.replace(/\/\/.*@/, "//***:***@") : mongoUri;
        // console.log("Connecting to MongoDB:", safeUri);
    

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;