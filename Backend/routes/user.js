import { getUserData, getEnrolledCourses, purchaseCourse, getUserCourseProgress, updateCourseProgess, addUserRating } from "../controllers/userController.js";
import { Router } from "express";

const UserRouter = Router();

UserRouter.get('/data', getUserData);
UserRouter.get('/enrolled-courses', getEnrolledCourses);
UserRouter.post('/purchase', purchaseCourse);

UserRouter.post('/update-course-progress',updateCourseProgess);
UserRouter.post('/get-course-progress', getUserCourseProgress);
UserRouter.post('/add-rating',addUserRating);
export default UserRouter;