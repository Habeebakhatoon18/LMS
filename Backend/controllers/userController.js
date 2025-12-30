import UserModel from "../models/user.js";
import PurchaseModel from "../models/purchase.js";
import CourseModel from "../models/course.js";
import stripeInstance from "../config/stripe.js";
import CourseProgress from '../models/courseProgess.js'

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();

        const user = await UserModel.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch user data" });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth();
        const userData = await UserModel.findOne({ id: userId }).populate('enrolledCourses');

        return res.status(200).json({ enrolledCourses: userData.enrolledCourses });
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
        const userData = await UserModel.findOne({ id: userId });

        const courseData = await CourseModel.findById(courseId);

        if (!courseData) {
            return res.status(404).json({ error: "Course not found" });
        }
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        const purchaseData = {
            userId,
            courseId: courseData._id,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }
        const newPurchase = await PurchaseModel.create(purchaseData);


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
                purchaseId: newPurchase._id.toString(),
            },
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to initiate purchase" });
    }
};

export const updateCourseProgess = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId, lectureId } = req.body;
        const progressData = await CourseProgress.findOne({ courseId, userId });
        if (progressData) {
            if (progressData.lecturesCompleted.includes(lectureId)) {
                return res.json({ status: true, message: 'lecture already complete' })
            }
            progressData.lecturesCompleted.push(lectureId);
            await progressData.save();
            return res.json({ status: true, message: 'lecture completed' })
        } else {
            await courseProgess.create({
                userId,
                courseId,
                lecturesCompleted: [lectureId]
            })
        }
        return res.json({ status: true, message: 'progress updated' })
    } catch (err) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update progress" });
    }
}

export const getUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ courseId, userId });
        return res.json({ status: true, progressData })
    } catch (err) {
        return res.json({ status: false, message: err.message })
    }
}

export const addUserRating = async (req, res) => {
    const userId = req.auth?.userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Invalid details", });
    }

    try {
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: "Course not found", });
        }

        const user = await UserModel.findOne({ id: userId });
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (!user.enrolledCourses.includes(course._id)) {
            return res.json({ success: false, message: "User has not purchased this course" });
        }

        const existingRatingIndex = course.courseRating.findIndex((r) =>
            r.userId.toString() === user._id.toString());

        if (existingRatingIndex > -1) {
            course.courseRating[existingRatingIndex].rating = rating;
        } else {
            course.courseRating.push({ userId: user._id, rating });
        }

        await course.save();

        return res.json({ success: true, message: "Rating added successfully" });
    } catch (error) {
        console.error("Add rating error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
