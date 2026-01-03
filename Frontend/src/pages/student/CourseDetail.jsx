import React, { useContext, useEffect, useState } from 'react';
import { Star, PlayCircle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const { id } = useParams();
  const { backendURL, userData, getToken, navigate } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  //fetchcourses
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/courses/${id}`);
      if (data.success) {
        setCourse(data.course);
        document.title = `${data.course.courseTitle} - SmartLearn`;
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) return toast.warn('Please login to enroll');
      if (isAlreadyEnrolled) return toast.info('Already enrolled');

      const token = await getToken();
      
      const { data } = await axios.post(
        `${backendURL}/user/purchase`,
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        window.location.replace(data.url);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // RATING LOGIC  
  const calculateRating = () => {
    if (!course?.courseRating?.length) return 0;
    const total = course.courseRating.reduce((sum, r) => sum + r.rating, 0);
    return (total / course.courseRating.length).toFixed(1);
  };

  const renderStars = () => {
    const rating = Math.round(calculateRating());
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }
      />
    ));
  };

  useEffect(() => {
    if(id) {
      fetchCourseData();
    }
  }, [id, backendURL]);


  useEffect(() => {
    if (userData && course) {
      setIsAlreadyEnrolled(userData.enrolledCourses?.includes(course._id));
    }
  }, [userData, course]);

  

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  //discounted price calculation
  const discountedPrice =
    course.coursePrice -
    (course.coursePrice * course.discount) / 100;

  return course ? (
    <div className="bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6 md:gap-10">

        {/* left content  */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            {course.courseTitle}
          </h1>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {course.courseDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm mb-6 md:mb-8">
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
              {renderStars()}
              <span className="text-yellow-700 font-semibold">
                {calculateRating()}
              </span>
            </div>

            <span className="text-gray-600">
              {course.enrolledStudents?.length || 0} students
            </span>

            <span className="text-gray-600">
              Course by{' '}
              <span className="text-blue-600 font-medium">
                {course.educator?.name || 'Instructor'}
              </span>
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Course Content
          </h3>

          <div className="space-y-4">
            {course.courseContent?.map(chapter => (
              <div
                key={chapter.chapterid}
                className="bg-white border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenSection(
                      openSection === chapter.chapterid
                        ? null
                        : chapter.chapterid
                    )
                  }
                  className="w-full px-5 py-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {chapter.chapterTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {chapter.chapterContent.length} lectures
                    </p>
                  </div>
                  <span className="text-lg font-bold text-gray-600">
                    {openSection === chapter.chapterid ? '−' : '+'}
                  </span>
                </button>

                {openSection === chapter.chapterid && (
                  <div className="divide-y">
                    {chapter.chapterContent.map(lecture => (
                      <div
                        key={lecture.lectureId}
                        className="px-5 py-3 flex justify-between items-center hover:bg-gray-50"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {lecture.lectureTitle}
                          </span>

                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{lecture.lectureDuration} min</span>

                            {lecture.isPreviewFree && lecture.lectureUrl ? (
                              <a
                                href={lecture.lectureUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                              >
                                <PlayCircle size={14} />
                                Preview
                              </a>
                            ) : (
                              <span className="text-gray-400">🔒 Locked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR  */}
        <aside className="lg:col-span-1 order-first lg:order-last">
          <div className="sticky top-24 bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <img
              src={course.courseThumbnail}
              alt={course.courseTitle}
              className="w-full h-48 object-cover rounded-lg mb-5"
            />

            <div className="flex items-end gap-3 mb-5">
              <span className="text-3xl font-bold text-gray-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {course.discount > 0 && (
                <>
                  <span className="line-through text-gray-400">
                    ${course.coursePrice}
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    {course.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => {
                if (isAlreadyEnrolled) {
                  navigate(`/player/${course._id}`);
                } else {
                  enrollCourse();
                }
              }}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition ${isAlreadyEnrolled
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {isAlreadyEnrolled ? 'Go to Course' : 'Enroll Now'}
            </button>


            <ul className="mt-6 text-sm text-gray-600 space-y-2">
              <li>✔ Lifetime access</li>
              <li>✔ Certificate of completion</li>
              <li>✔ Learn at your own pace</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  ) : <Loading />
};

export default CourseDetail;
