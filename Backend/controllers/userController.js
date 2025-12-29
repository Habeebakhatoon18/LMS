import UserModel from "../models/user.js";
import PurchaseModel from "../models/purchase.js";
import CourseModel from "../models/course.js";
import stripe from 'stripe';

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        
        console.log("userid",userId);
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
        
        return res.status(200).json({enrolledCourses : userData.enrolledCourses});
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
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice /100 ).toFixed(2)
         }
         const newPurchase = await PurchaseModel.create(purchaseData);

         const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
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

