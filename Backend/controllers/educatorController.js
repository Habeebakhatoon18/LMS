import {v2 as cloudinary} from "cloudinary";
import courseModel from "../models/course.js";
import { clerkClient } from "@clerk/express";
import purchaseModel from "../models/purchase.js";
import UserModel from "../models/user.js";

const updatedToEducator = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ correct & future-proof

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    return res.json({ message: "User role updated to educator" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update role" });
  }
};

export const addCourse = async (req, res) => {
  try {
    const {courseData} = req.body;
    const img = req.file;
    const educatorId = req.auth().userId;

    if(!img){
      return res.status(400).json({ error: "Image file is required" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await courseModel.create(parsedCourseData);


    const imgPath = await cloudinary.uploader.upload(img.path);
    newCourse.courseThumbnail = imgPath.secure_url;
    await newCourse.save();

    return res.status(201).json({ message: "Course added successfully"});
  

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add course" });
  }
};

export const getEducatorCourses = async (req, res) => {
  try {
    const educatorId = req.auth().userId;
    const courses = await courseModel.find({ educator: educatorId });
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const educatorId = req.auth().userId;
    const courses = await courseModel.find({ educator: educatorId });
    const totalCourses = courses.length;

    const purchases = await purchaseModel.find({ courseId: { $in: courses.map(course => course._id) }, status: "completed" });
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentData = [];
    for (const course of courses) {
      const students = await UserModel.find({
        id: {$in : course.enrolledStudents},
        
      },'name imageUrl');
      students.forEach((student) => {
        enrolledStudentData.push({
          courseTitle: course.title,
          student
        });
      });
    }
    return res.json({status:"success", DashboardData: { totalCourses, totalEarnings, enrolledStudents: enrolledStudentData }});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

const getEnrolledStudents = async (req, res) => {
  const educatorId = req.auth().userId;
  try {
    const courses = await courseModel.find({ educator: educatorId });
    const purchases = await purchaseModel.find({ courseId: { $in: courses.map(course => course._id) }, status: "completed" }).populate('userId', 'name imageUrl').populate('courseId', 'title');
    const enrolledStudents = [];
    for (const purchase of purchases) {
      enrolledStudents.push({
        student: purchase.userId,
        course: purchase.courseId
      });
    }
    return res.json({status:"success", enrolledStudents});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch enrolled students" });
  }
};

export  {updatedToEducator, getDashboardData, getEnrolledStudents};
