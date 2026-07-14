// import courseModel from '../models/course.js';
import prisma from '../config/prisma.js';

const getAllCourses = async (req, res) => {
    try {
        // const courses = await courseModel.find({ isPublished: true }).select(['-courseContent']).populate({ path: 'educator' });
        const coursesData = await prisma.course.findMany({
            where: { isPublished: true },
            include: {
                educator: {
                    select: {
                        dbId: true,
                        id: true,
                        name: true,
                        email: true,
                        imgUrl: true
                    }
                }
            }
        });

        const courses = coursesData.map(course => ({
            ...course,
            _id: course.id,
            educator: course.educator ? {
                ...course.educator,
                _id: course.educator.dbId
            } : null
        }));

        return res.json({ success: true, courses });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, error: "Failed to fetch courses" });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        // const course = await courseModel.findById(courseId).populate({ path: 'educator' });
        const rawCourse = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                educator: {
                    select: {
                        dbId: true,
                        id: true,
                        name: true,
                        email: true,
                        imgUrl: true
                    }
                },
                courseContent: {
                    orderBy: { chapterOrder: 'asc' },
                    include: {
                        chapterContent: {
                            orderBy: { lectureOrder: 'asc' }
                        }
                    }
                }
            }
        });

        if (!rawCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Deep clone or construct compatible structure
        const course = {
            ...rawCourse,
            _id: rawCourse.id,
            educator: rawCourse.educator ? {
                ...rawCourse.educator,
                _id: rawCourse.educator.dbId
            } : null,
            courseContent: rawCourse.courseContent.map(chapter => ({
                ...chapter,
                _id: chapter.id,
                chapterContent: chapter.chapterContent.map(lecture => {
                    const mappedLecture = {
                        ...lecture,
                        _id: lecture.id
                    };
                    if (!mappedLecture.isPreviewFree) {
                        mappedLecture.lectureUrl = null;
                    }
                    return mappedLecture;
                })
            }))
        };

        return res.json({ success: true, course });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch course" });
    }
};
export { getAllCourses, getCourseById };