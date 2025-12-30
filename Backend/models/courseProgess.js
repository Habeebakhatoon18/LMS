import mongoose from 'mongoose';

const courseProgress = new mongoose.Schema({
    userId:{type:String,required : true},
    courseId:{type:String,required : true},
    lecturesCompleted:[],
    completed:{type :Boolean,default:false},

},{minimize:false})
export default mongoose.model("CourseProgess",courseProgress);