import courseModel from '../models/course.js';

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.find({ isPublished: true }).select(['-courseContent','-enrolledStudents']).populate({path :'educator'});
        return res.status(200).json(courses);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch courses" });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await courseModel.findById(courseId).populate({path :'educator'});
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

        return res.status(200).json(course);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch course" });
    }
};
export { getAllCourses, getCourseById };