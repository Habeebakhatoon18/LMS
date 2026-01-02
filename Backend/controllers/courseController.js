import courseModel from '../models/course.js';

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.find({ isPublished: true }).select(['-courseContent']).populate({ path: 'educator' });
        return res.json({ success: true, courses });
    } catch (error) {

        return res.json({ success: false, error: "Failed to fetch courses" });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await courseModel.findById(courseId).populate({ path: 'educator' });
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        course.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = null;
                }
            });
        });

        return res.json({ success: true, course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch course" });
    }
};
export { getAllCourses, getCourseById };