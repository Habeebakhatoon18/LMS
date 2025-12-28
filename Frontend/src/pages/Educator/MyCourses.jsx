import React from 'react'
import Loading from '../../components/Student/Loading'
import { useEffect, useState } from 'react';
const MyCourses = () => {
  const [courses, setCourses] = useState(null);

  // Dummy data used locally in this file for development
  const currency = 'USD';
  const dummyCourses = [
    {
      _id: 'c1',
      courseThumbnail: '/src/assets/logo.png',
      courseTitle: 'React for Beginners',
      enrolledStudents: [ { id: 's1' }, { id: 's2' }, { id: 's3' } ],
      coursePrice: 39.99,
      discount: 10,
      createdAt: '2025-10-05T10:00:00.000Z',
    },
    {
      _id: 'c2',
      courseThumbnail: '/src/assets/react.svg',
      courseTitle: 'Advanced Node.js',
      enrolledStudents: [ { id: 's4' }, { id: 's5' } ],
      coursePrice: 49.99,
      discount: 0,
      createdAt: '2025-09-12T09:30:00.000Z',
    },
    {
      _id: 'c3',
      courseThumbnail: '/src/assets/logo.png',
      courseTitle: 'Data Science 101',
      enrolledStudents: [ { id: 's6' } ],
      coursePrice: 59.99,
      discount: 20,
      createdAt: '2025-08-20T14:15:00.000Z',
    },
  ];

const fetchEducatorCourses = async () => {
  
  setCourses(dummyCourses);
};

useEffect(() => {
  fetchEducatorCourses();
}, []);

  return courses? (
    <div>
      <div className="w-full p-4 m-4">
 <h2 className="pb-4 text-lg font-bold">My Courses</h2>

  <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
    <table className="md:table-auto table-fixed w-full overflow-hidden">
      <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
        <tr>
          <th className="px-4 py-3 font-semibold truncate">
            All Courses
          </th>
          <th className="px-4 py-3 font-semibold truncate">
            Earnings
          </th>
          <th className="px-4 py-3 font-semibold truncate">
            Students
          </th>
          <th className="px-4 py-3 font-semibold truncate">
            Published On
          </th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-500">
  {courses.map((course) => (
    <tr
      key={course._id}
      className="border-b border-gray-500/20"
    >
      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
        <img
          src={course.courseThumbnail}
          alt="Course Image"
          className="w-16"
        />
        <span className="truncate hidden md:block">
          {course.courseTitle}
        </span>
      </td>

      <td className="px-4 py-3">
        {currency}{' '}
        {Math.floor(
          course.enrolledStudents.length *
            (course.coursePrice -
              (course.discount * course.coursePrice) / 100)
        )}
      </td>

      <td className="px-4 py-3">
        {course.enrolledStudents.length}
      </td>

      <td className="px-4 py-3">
        {new Date(course.createdAt).toLocaleDateString()}
      </td>
    </tr>
  ))}
</tbody>

    </table>
  </div>
</div>

    </div>
  ) : <Loading />;
}

export default MyCourses