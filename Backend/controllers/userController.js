// import UserModel from "../models/user.js";
// import PurchaseModel from "../models/purchase.js";
// import CourseModel from "../models/course.js";
// import stripeInstance from "../config/stripe.js";
// import CourseProgress from '../models/courseProgess.js'
import stripeInstance from "../config/stripe.js";
import prisma from '../config/prisma.js';

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        
        //const userId = "user_student_456"; // Hardcoded for testing purposes
        // const user = await UserModel.findOne({ id: userId });
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrolledCourses: {
                    select: { id: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Format to match Mongoose document shape
        const formattedUser = {
            ...user,
            _id: user.dbId,
            enrolledCourses: user.enrolledCourses.map(c => c.id)
        };

        return res.json({ success: true, user: formattedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch user data" });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth();
        if (!userId) return;
        // const userId = "user_student_456"; // Hardcoded for testing purposes
        // const userData = await UserModel.findOne({ id: userId }).populate({
        //     path: 'enrolledCourses',
        //     populate: { path: 'educator' }
        // });
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrolledCourses: {
                    include: {
                        educator: {
                            select: {
                                dbId: true,
                                id: true,
                                name: true,
                                email: true,
                                imgUrl: true
                            }
                        }
                    }
                }
            }
        });

        const enrolledCourses = userData ? userData.enrolledCourses.map(course => ({
            ...course,
            _id: course.id,
            educator: course.educator ? {
                ...course.educator,
                _id: course.educator.dbId
            } : null
        })) : [];

        return res.json({ success: true, enrolledCourses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch enrolled courses" });
    }
};

export const purchaseCourse = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId } = req.body;
        const origin = req.headers.origin;
       // const userId = "user_student_456"; // Hardcoded for testing purposes
        //const courseId = "course_123"; // Hardcoded for testing purposes

        // const userData = await UserModel.findOne({ id: userId });
        // const courseData = await CourseModel.findById(courseId);
        const userData = await prisma.user.findUnique({
            where: { id: userId }
        });

        const courseData = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!courseData) {
            return res.status(404).json({ error: "Course not found" });
        }
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        const amount = (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2);

        // const newPurchase = await PurchaseModel.create(purchaseData);
        const newPurchase = await prisma.purchase.create({
            data: {
                userId: userData.id,
                courseId: courseData.id,
                amount: parseFloat(amount),
                status: 'pending'
            }
        });

        const currency = process.env.CURRENCY.toLowerCase() || 'USD';
        const lineItems = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle,
                    },
                    unit_amount: Math.round(Number(newPurchase.amount) * 100)// amount in cents
                },
                quantity: 1,
            }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: lineItems,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase.id.toString(),
            },
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to initiate purchase" });
    }
};

export const updateCourseProgess = async (req, res) => {
    try {
        const { userId } = req.auth();
        //const userId = "user_student_456"; // Hardcoded for testing purposes
        const { courseId, lectureId } = req.body;
        
        // const progressData = await CourseProgress.findOne({ courseId, userId });
        const progressData = await prisma.courseProgress.findFirst({
            where: { courseId, userId },
            include: { lecturesCompleted: true }
        });

        if (progressData) {
            const alreadyCompleted = progressData.lecturesCompleted.some(l => l.lectureId === lectureId);
            if (alreadyCompleted) {
                return res.json({ success: true, message: 'lecture already complete' })
            }
            
            // progressData.lecturesCompleted.push(lectureId);
            // await progressData.save();
            await prisma.completedLecture.create({
                data: {
                    progressId: progressData.id,
                    lectureId: lectureId
                }
            });

            return res.json({ success: true, message: 'lecture completed' })
        } else {
            // await CourseProgress.create({
            //     userId,
            //     courseId,
            //     lecturesCompleted: [lectureId]
            // })
            await prisma.courseProgress.create({
                data: {
                    userId,
                    courseId,
                    lecturesCompleted: {
                        create: {
                            lectureId: lectureId
                        }
                    }
                }
            });
        }
        return res.json({ status: true, message: 'progress updated' })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update progress" });
    }
}

export const getUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId } = req.body;
        //const userId = "user_student_456"; // Hardcoded for testing purposes
        // const progressData = await CourseProgress.findOne({ courseId, userId });
        const rawProgress = await prisma.courseProgress.findFirst({
            where: { courseId, userId },
            include: { lecturesCompleted: true }
        });

        const progressData = rawProgress ? {
            ...rawProgress,
            _id: rawProgress.id,
            lecturesCompleted: rawProgress.lecturesCompleted.map(l => l.lectureId)
        } : null;

        return res.json({ success: true, progressData })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export const addUserRating = async (req, res) => {
    const userId = req.auth?.userId || (req.auth && typeof req.auth === 'function' ? req.auth().userId : null);
    // const userId = "user_student_456"; // Hardcoded for testing purposes
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Invalid details", });
    }

    try {
        // const course = await CourseModel.findById(courseId);
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!course) {
            return res.json({ success: false, message: "Course not found", });
        }

        // const user = await UserModel.findOne({ id: userId });
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrolledCourses: {
                    select: { id: true }
                }
            }
        });
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // if (!user.enrolledCourses.includes(course._id)) {
        const isEnrolled = user.enrolledCourses.some(c => c.id === course.id);
        if (!isEnrolled) {
            return res.json({ success: false, message: "User has not purchased this course" });
        }

        // const existingRatingIndex = course.courseRating.findIndex((r) => r.userId.toString() === user._id.toString());
        // if (existingRatingIndex > -1) { ... } else { ... }
        // await course.save();
        await prisma.courseRating.upsert({
            where: {
                userId_courseId: {
                    userId: user.dbId,
                    courseId: course.id
                }
            },
            update: { rating: rating },
            create: {
                userId: user.dbId,
                courseId: course.id,
                rating: rating
            }
        });

        return res.json({ success: true, message: "Rating added successfully" });
    } catch (error) {
        console.error("Add rating error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
