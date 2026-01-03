import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Loading from '../../components/Student/Loading';
import { AppContext } from '../../context/AppContext';
import {toast} from 'react-toastify';
import { FaUserGraduate, FaBook, FaDollarSign } from 'react-icons/fa';

import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const {backendURL, getToken} = useContext(AppContext);

  const fetchDashboardData = async () => {
     try {
          const token = await getToken();
          const { data } = await axios.get(`${backendURL}/educator/dashboard`, 
            {headers : {Authorization : `Bearer ${token}`}});
          if (data.success) {
            setDashboardData(data.DashboardData);
          } else {
            toast.error(data.message);
          }
        } catch (err) {
          toast.error(err.message);
        }
  }

  useEffect(() => {
    fetchDashboardData();
  }, [backendURL, getToken]);
  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
     
      <div className="space-y-5 w-full">
         <h2 className='font-bold text-xl md:text-2xl'>Dashboard</h2>
        <div className="flex flex-wrap gap-4 md:gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-full sm:w-56 rounded-md">
            <FaUserGraduate className="text-2xl md:text-3xl text-blue-600" />
            <div>
              <p className="text-xl md:text-2xl font-medium text-gray-600">
                {dashboardData.enrolledStudents.length || 0}
              </p>
              <p className="text-sm md:text-base text-gray-500">Total Enrolments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-full sm:w-56 rounded-md">
            <FaBook className="text-2xl md:text-3xl text-blue-600" />
            <div>
              <p className="text-xl md:text-2xl font-medium text-gray-600">
                {dashboardData.totalCourses || 0}
              </p>
              <p className="text-sm md:text-base text-gray-500">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-full sm:w-56 rounded-md">
            <FaDollarSign className="text-2xl md:text-3xl text-blue-600" />
            <div>
              <p className="text-xl md:text-2xl font-medium text-gray-600">
                {dashboardData.totalEarnings || 0}
              </p>
              <p className="text-sm md:text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrolments</h2>

          <div className="flex flex-col items-center max-w-4xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-left">
                <tr>
                  <th className="px-2 md:px-4 py-3 font-semibold text-center hidden sm:table-cell text-sm md:text-base">
                    #
                  </th>
                  <th className="px-2 md:px-4 py-3 font-semibold text-sm md:text-base">Student Name</th>
                  <th className="px-2 md:px-4 py-3 font-semibold text-sm md:text-base">Course Title</th>
                </tr>
              </thead>

              <tbody className="text-xs md:text-sm text-gray-500">
                {dashboardData.enrolledStudents.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-500/20"
                  >
                    <td className="px-2 md:px-4 py-3 text-center hidden sm:table-cell">
                      {index + 1}
                    </td>

                    <td className="px-2 md:px-4 py-3 flex items-center space-x-2 md:space-x-3">
                      <img
                         src={item.student.imgUrl}
                        alt="Profile"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                      />
                      <span className="truncate max-w-[150px] md:max-w-none">
                        {item.student.name}
                      </span>
                    </td>

                    <td className="px-2 md:px-4 py-3 truncate max-w-[200px] md:max-w-none">
                      {item.courseTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
    : <Loading />;
}

export default Dashboard