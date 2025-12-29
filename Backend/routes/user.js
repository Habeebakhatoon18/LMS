import { getUserData, getEnrolledCourses } from "../controllers/userController.js";
import { Router } from "express";

const UserRouter = Router();

UserRouter.get('/data', getUserData);
UserRouter.get('/enrolled-courses', getEnrolledCourses);

export default UserRouter;