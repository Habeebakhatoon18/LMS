import mongoose from "mongoose";

const purchase = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    status : { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
},
    { timestamps: true }
);
export default mongoose.model("Purchase", purchase);
