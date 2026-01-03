import React from 'react'
import { useState, useEffect, useContext } from 'react';
import Loading from '../../components/Student/Loading';
import axios from 'axios';
import { AppContext} from '../../context/AppContext';
import { toast } from 'react-toastify';

const StudentsEnroll = () => {
  const [studentsEnrolled, setStudentsEnrolled] = useState([]);
  const { backendURL, getToken,currency } = useContext(AppContext);
  // Inline dummy data for development
  // const dummyCourses = [
  //   {
  //     _id: 'e1',
  //     studentThumbnail: '/src/assets/logo.png',
  //     studentName: 'Alice Johnson',
  //     courseTitle: 'React for Beginners',
  //     enrolledAt: '2025-11-01T10:00:00.000Z',
  //   },
  //   {
  //     _id: 'e2',
  //     studentThumbnail: '/src/assets/react.svg',
  //     studentName: 'Bob Smith',
  //     courseTitle: 'Advanced Node.js',
  //     enrolledAt: '2025-10-21T09:30:00.000Z',
  //   },
  //   {
  //     _id: 'e3',
  //     studentThumbnail: '/src/assets/logo.png',
  //     studentName: 'Carlos Lopez',
  //     courseTitle: 'Data Science 101',
  //     enrolledAt: '2025-09-14T14:15:00.000Z',
  //   },
  // ];

  const fetchStudentsEnrolled = async () => {
     try {
      const token = await getToken();
      const { data } = await axios.get(`${backendURL}/educator/enrolled-students`, 
        {headers : {Authorization : `Bearer ${token}`}});
      if (data.success) {
        setStudentsEnrolled(data.enrolledStudents);
        console.log(data.enrolledStudents);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

useEffect(() => {
  fetchStudentsEnrolled();
}, []);
  return studentsEnrolled ? (
    <div className='w-full p-4 mb-4'>
      <h2 className='font-bold m-4'>Students Enrolled</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
    <table className="md:table-auto table-fixed w-full overflow-hidden">
      <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
        <tr>
          <th className="px-4 py-3 font-semibold truncate">
            Student Name
          </th>
          <th className="px-4 py-3 font-semibold truncate">
            Course Title
          </th>
          <th className="px-4 py-3 font-semibold truncate">
            Date
          </th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-500">
  {studentsEnrolled.map((std) => (
    <tr
      key={std._id}
      className="border-b border-gray-500/20"
    >
      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
        <img
          src={std.studentThumbnail !== '' ? std.studentThumbnail :"http://www.freepik.com/premium-vector/user-profile-ux-vector-persona-avatar-design-vector-flat-isolated-illustration_133465878.htm"}
          alt="Student Image"
          className="w-16"
        />
        <span className="truncate hidden md:block">
          {std.studentName}
        </span>
      </td>

      

      <td className="px-4 py-3">
        {std.courseTitle}
      </td>

      <td className="px-4 py-3">
        {new Date(std.enrolledAt).toLocaleDateString()}
      </td>
    </tr>
  ))}
</tbody>

    </table>
  </div>
    </div>
  ) : <Loading />;
}

export default StudentsEnroll