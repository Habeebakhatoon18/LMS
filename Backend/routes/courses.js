import Router from 'express';
import { getAllCourses,getCourseById } from '../controllers/courseController.js';

const CourseRouter = Router();

CourseRouter.get('/all', getAllCourses);
CourseRouter.get('/:id', getCourseById);

export default CourseRouter;