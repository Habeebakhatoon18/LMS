import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    imgUrl : { type: String },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
}, { timestamps: true });
const User = mongoose.model("User", userSchema);


export default User ;