import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext} from '../../context/AppContext';
import { toast } from 'react-toastify';

const StudentsEnroll = () => {
  const [studentsEnrolled, setStudentsEnrolled] = useState([]);
  const { backendURL, getToken } = useContext(AppContext);

  const fetchStudentsEnrolled = async () => {
     try {
      const token = await getToken();
      const { data } = await axios.get(`${backendURL}/educator/enrolled-students`, 
        {headers : {Authorization : `Bearer ${token}`}});
      if (data.success) {
        setStudentsEnrolled(data.enrolledStudents);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchStudentsEnrolled();
  }, [backendURL, getToken]);

  return studentsEnrolled.length > 0 ? (
    <div className='w-full p-4 md:p-6'>
      <h2 className='font-bold text-lg md:text-xl mb-4 md:mb-6'>Students Enrolled</h2>
      <div className="w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed w-full">
          <colgroup>
            <col className="w-[35%]" />
            <col className="w-[40%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead className="text-gray-900 border-b border-gray-500/20 text-xs md:text-sm text-left">
            <tr>
              <th className="px-2 md:px-4 py-3 font-semibold">
                Student Name
              </th>
              <th className="px-2 md:px-4 py-3 font-semibold">
                Course Title
              </th>
              <th className="px-2 md:px-4 py-3 font-semibold">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm text-gray-500">
            {studentsEnrolled.map((std) => (
              <tr
                key={std._id}
                className="border-b border-gray-500/20"
              >
                <td className="px-2 md:px-4 py-3">
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                    <img
                      src={std.studentThumbnail || "https://via.placeholder.com/64"}
                      alt="Student"
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="truncate block min-w-0">
                      {std.studentName}
                    </span>
                  </div>
                </td>

                <td className="px-2 md:px-4 py-3">
                  <span className="truncate block">
                    {std.courseTitle}
                  </span>
                </td>

                <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                  {new Date(std.enrolledAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className='w-full p-4 md:p-6 min-h-[400px] flex items-center justify-center'>
      <h2 className='text-center text-gray-500 text-lg md:text-xl'>No students enrolled yet</h2>
    </div>
  );
}

export default StudentsEnroll