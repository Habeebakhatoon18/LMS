import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Navbar from '../../components/Student/Navbar'
import { toast } from 'react-toastify';
import axios from 'axios';

const MyEnrolment = () => {
  const { enrolledCourses, navigate, userData, backendURL, getToken, fetchUserEnrolledCourses } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState(null);

  const calculateNoOfLectures = (course) => {
    if (!course?.courseContent) return 0;

    return course.courseContent.reduce((total, chapter) => {
      return total + (chapter.chapterContent?.length || 0);
    }, 0);
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(`${backendURL}/user/get-course-progress`, { courseId: course._id }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          let totalLectures = calculateNoOfLectures(course);
          const lecturesCompleted = data.progressData ? data.progressData.lecturesCompleted.length : 0;
          return { totalLectures, lecturesCompleted }
        })

      )
      setProgressArray(tempProgressArray)
    } catch (err) {
      toast.error(err.message);
    }
  }
  
  // Fetch enrolled courses when userData is available
  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData, fetchUserEnrolledCourses]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses, backendURL, getToken]);

  // Remove duplicate courses by _id
  const uniqueCourses = Array.from(
    new Map(enrolledCourses?.map(c => [c._id, c])).values()
  );

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">     
        <h2 className="text-3xl mt-12 font-bold text-gray-900 mb-8">
          My Enrollments
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase">
                  Course
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase hidden sm:table-cell">
                  Price
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase hidden md:table-cell">
                  Educator
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase">
                  Progress
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {uniqueCourses?.length > 0 ? (
                uniqueCourses.map((course, index) => {
                  const progress = progressArray?.[index];

                  const totalLectures = progress?.totalLectures || 0;
                  const completedLectures = progress?.lecturesCompleted || 0;

                  const progressPercent = totalLectures
                    ? Math.round((completedLectures / totalLectures) * 100)
                    : 0;

                  const status =
                    totalLectures > 0 &&
                      completedLectures === totalLectures
                      ? 'Completed'
                      : 'On Going';

                  return (
                    <tr
                      key={course._id}
                      className="hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => navigate(`/player/${course._id}`)}
                    >
                      {/* Course */}
                      <td className="px-3 md:px-6 py-3 md:py-4 flex items-center gap-2 md:gap-4">
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-12 h-8 md:w-20 md:h-12 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-gray-800 text-xs md:text-sm truncate">
                            {course.courseTitle}
                          </span>
                          <span className="text-xs text-gray-500 sm:hidden">
                            ₹{course.coursePrice}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 font-medium text-xs md:text-sm hidden sm:table-cell">
                        ₹{course.coursePrice}
                      </td>

                      {/* Educator */}
                      <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 font-medium text-xs md:text-sm hidden md:table-cell">
                        {course.educator?.name}
                      </td>

                      {/* Progress */}
                      <td className="px-3 md:px-6 py-3 md:py-4 min-w-[120px] md:w-48">
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {completedLectures}/{totalLectures} Lectures
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <span
                          className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${status === 'Completed'
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white'
                            }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-400 text-sm md:text-base"
                  >
                    No enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};

export default MyEnrolment;
