import {Router} from 'express';
import {updatedToEducator,getEducatorCourses, addCourse, getEnrolledStudents, getDashboardData}from '../controllers/educatorController.js';
import protectEducator from '../middlewares/AuthMiddleware.js';
import upload from '../config/multer.js';

const EducatorRouter = Router();
EducatorRouter.get('/', (req, res) => {
    res.send("Educator route is working");
});
EducatorRouter.get('/update-role', updatedToEducator);

EducatorRouter.post('/add-course',  upload.single('image'), protectEducator,addCourse);

EducatorRouter.get('/courses', protectEducator, getEducatorCourses);
EducatorRouter.get('/dashboard', protectEducator, getDashboardData);
EducatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudents);

export default EducatorRouter;