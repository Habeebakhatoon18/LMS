import { getUserData, getEnrolledCourses, purchaseCourse } from "../controllers/userController.js";
import { Router } from "express";

const UserRouter = Router();

UserRouter.get('/data', getUserData);
UserRouter.get('/enrolled-courses', getEnrolledCourses);
UserRouter.post('/purchase', purchaseCourse);
export default UserRouter;