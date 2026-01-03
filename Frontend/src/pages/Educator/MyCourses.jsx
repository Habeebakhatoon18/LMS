import React, { useContext } from 'react'
import Loading from '../../components/Student/Loading'
import { useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {toast} from 'react-toastify';
import axios from 'axios';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const { backendURL, getToken } = useContext(AppContext);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendURL}/educator/courses`, 
        {headers : {Authorization : `Bearer ${token}`}});
      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, [backendURL, getToken]);

  return courses ? (
    <div className="w-full p-4 md:p-6">
      <h2 className="pb-4 text-lg md:text-xl font-bold">My Courses</h2>

      <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed w-full">
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead className="text-gray-900 border-b border-gray-500/20 text-xs md:text-sm text-left">
            <tr>
              <th className="px-2 md:px-4 py-3 font-semibold">
                All Courses
              </th>
              <th className="px-2 md:px-4 py-3 font-semibold">
                Earnings
              </th>
              <th className="px-2 md:px-4 py-3 font-semibold">
                Students
              </th>
              <th className="px-2 md:px-4 py-3 font-semibold">
                Published On
              </th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm text-gray-500">
            {courses.map((course) => (
              <tr
                key={course._id}
                className="border-b border-gray-500/20"
              >
                <td className="px-2 md:px-4 py-3">
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                    <img
                      src={course.courseThumbnail}
                      alt="Course Image"
                      className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                    />
                    <span className="truncate block min-w-0">
                      {course.courseTitle}
                    </span>
                  </div>
                </td>

                <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                  ${Math.floor(
                    course.enrolledStudents.length *
                    (course.coursePrice -
                      (course.discount * course.coursePrice) / 100)
                  )}
                </td>

                <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                  {course.enrolledStudents.length}
                </td>

                <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  ) : <Loading />;
}

export default MyCourses