import UserModel from "../models/user.js";

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