import { v2 as cloudinary } from "cloudinary";
// import courseModel from "../models/course.js";
import { clerkClient } from "@clerk/express";
// import purchaseModel from "../models/purchase.js";
// import UserModel from "../models/user.js";
// import mongoose from "mongoose";
import prisma from "../config/prisma.js";

const updatedToEducator = async (req, res) => {
  try {
    const { userId } = req.auth();

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    return res.json({ success: true, message: "User role updated to educator" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update role" });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const img = req.file;
    const educatorId = req.auth().userId;
   // const educatorUser = await UserModel.findOne({ id: educatorId });
    const educatorUser = await prisma.user.findUnique({
      where: { id: educatorId }
    });
    if (!img) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    // parsedCourseData.educator = educatorUser._id;
    const imgPath = await cloudinary.uploader.upload(img.path);
    parsedCourseData.courseThumbnail = imgPath.secure_url;
    // const newCourse = await courseModel.create(parsedCourseData);
    const newCourse = await prisma.course.create({
      data: {
        courseTitle: parsedCourseData.courseTitle,
        courseDescription: parsedCourseData.courseDescription,
        courseThumbnail: parsedCourseData.courseThumbnail,
        coursePrice: Number(parsedCourseData.coursePrice),
        isPublished: parsedCourseData.isPublished ?? true,
        discount: Number(parsedCourseData.discount),
        educatorId: educatorUser.dbId,
        courseContent: {
          create: parsedCourseData.courseContent.map(chapter => ({
            chapterId: chapter.chapterId,
            chapterOrder: Number(chapter.chapterOrder),
            chapterTitle: chapter.chapterTitle,
            chapterContent: {
              create: chapter.chapterContent.map(lecture => ({
                lectureId: lecture.lectureId,
                lectureTitle: lecture.lectureTitle,
                lectureDuration: Number(lecture.lectureDuration),
                lectureUrl: lecture.lectureUrl,
                isPreviewFree: Boolean(lecture.isPreviewFree),
                lectureOrder: Number(lecture.lectureOrder)
              }))
            }
          }))
        }
      }
    });

    return res.json({ success: true, message: "Course added successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add course" });
  }
};

export const getEducatorCourses = async (req, res) => {
  try {
    //const educatorId = req.auth().userId;
    const educatorId = "user_educator_123"; // Hardcoded for testing purposes

    // const educatorUser = await UserModel.findOne({ id: educatorId });
    // const courses = await courseModel.find({ educator: educatorUser._id });
    const educatorUser = await prisma.user.findUnique({
      where: { id: educatorId }
    });
    let courses = [];
    if (educatorUser) {
      courses = await prisma.course.findMany({
        where: { educatorId: educatorUser.dbId }
      });
      // Format to support _id response field expected by frontend
      courses = courses.map(c => ({
        ...c,
        _id: c.id
      }));
    }
    return res.json({ success: true, courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const getDashboardData = async (req, res) => {
  try {
   const educatorId = req.auth().userId;
    //const educatorId = "user_educator_123"; // Hardcoded for testing purposes
    // const courses = await courseModel.find({ educator: educatorId });
    // const educatorUser = await UserModel.findOne({ id: educatorId });
    // const courses = await courseModel.find({ educator: educatorUser._id });
    const educatorUser = await prisma.user.findUnique({
      where: { id: educatorId }
    });

    if (!educatorUser) {
      return res.status(404).json({ error: "Educator not found" });
    }

    const courses = await prisma.course.findMany({
      where: { educatorId: educatorUser.dbId },
      include: {
        enrolledStudents: {
          select: {
            dbId: true,
            name: true,
            imgUrl: true
          }
        }
      }
    });

    const totalCourses = courses.length;

    // const purchases = await purchaseModel.find({ courseId: { $in: courses.map(course => course._id) }, status: "completed" });
    const courseIds = courses.map(c => c.id);
    const purchases = await prisma.purchase.findMany({
      where: {
        courseId: { in: courseIds },
        status: "completed"
      }
    });
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentData = [];
    for (const course of courses) {
      // const students = await UserModel.find(
      //   {
      //     _id: { $in: course.enrolledStudents.map(id => new mongoose.Types.ObjectId(id)) }
      //   },
      //   'name imgUrl'
      // );
      //
      // students.forEach(student => {
      //   enrolledStudentData.push({
      //     courseTitle: course.courseTitle,
      //     student
      //   });
      // });
      course.enrolledStudents.forEach(student => {
        enrolledStudentData.push({
          courseTitle: course.courseTitle,
          student: {
            _id: student.dbId,
            name: student.name,
            imgUrl: student.imgUrl
          }
        });
      });
    }
    return res.json({ success: true, DashboardData: { totalCourses, totalEarnings, enrolledStudents: enrolledStudentData } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

const getEnrolledStudents = async (req, res) => {
  try {
    const educatorId = req.auth().userId;
    //const educatorId = "user_educator_123"; // Hardcoded for testing purposes
    // const educatorUser = await UserModel.findOne({ id: educatorId });
    const educatorUser = await prisma.user.findUnique({
      where: { id: educatorId }
    });
    if (!educatorUser) {
      return res.status(404).json({ success: false, message: "Educator not found" });
    }

    // const courses = await courseModel
    //   .find({ educator: educatorUser._id })
    //   .select("_id courseTitle");
    const courses = await prisma.course.findMany({
      where: { educatorId: educatorUser.dbId },
      select: { id: true, courseTitle: true }
    });

    // const courseMap = Object.fromEntries(
    //   courses.map(c => [c._id.toString(), c.courseTitle])
    // );
    const courseMap = Object.fromEntries(
      courses.map(c => [c.id, c.courseTitle])
    );

    // Get purchases for these courses
    // const purchases = await purchaseModel
    //   .find({
    //     courseId: { $in: courses.map(c => c._id) },
    //     status: "completed"
    //   });
    const courseIds = courses.map(c => c.id);
    const purchases = await prisma.purchase.findMany({
      where: {
        courseId: { in: courseIds },
        status: "completed"
      },
      include: {
        user: {
          select: {
            name: true,
            imgUrl: true
          }
        }
      }
    });

    // Map purchases to include student info manually
    // const enrolledStudents = await Promise.all(
    //   purchases.map(async (purchase) => {
    //     const user = await UserModel.findOne({ id: purchase.userId }); // lookup by string ID
    //     return {
    //       _id: purchase._id,
    //       studentName: user?.name || "Unknown",
    //       studentThumbnail: user?.imgUrl || "",
    //       courseTitle: courseMap[purchase.courseId.toString()],
    //       enrolledAt: purchase.createdAt
    //     };
    //   })
    // );
    const enrolledStudents = purchases.map((purchase) => {
      return {
        _id: purchase.id,
        studentName: purchase.user?.name || "Unknown",
        studentThumbnail: purchase.user?.imgUrl || "",
        courseTitle: courseMap[purchase.courseId],
        enrolledAt: purchase.createdAt
      };
    });

    return res.json({ success: true, enrolledStudents });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch enrolled students" });
  }
};


export { updatedToEducator, getDashboardData, getEnrolledStudents };
