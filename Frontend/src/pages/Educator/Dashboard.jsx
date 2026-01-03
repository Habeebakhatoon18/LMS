import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Loading from '../../components/Student/Loading';
import { AppContext } from '../../context/AppContext';
import {toast} from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const {backendURL, getToken} = useContext(AppContext);

  const assets = {
    patients_icon: '/src/assets/logo.png',
    appointment_icon: '/src/assets/logo.png',
    earning_icon: '/src/assets/logo.png',
  };
  // const dummyData = {
  //   enrolledStudentsData: [
  //     { id: 's1', name: 'Alice Johnson', course: 'React for Beginners', enrolledAt: '2025-11-01' },
  //     { id: 's2', name: 'Bob Smith', course: 'Advanced Node.js', enrolledAt: '2025-10-21' },
  //     { id: 's3', name: 'Carlos Lopez', course: 'Data Science 101', enrolledAt: '2025-09-14' },
  //     { id: 's4', name: 'Diana Prince', course: 'Intro to Python', enrolledAt: '2025-12-03' },
  //   ],
  //   totalcourses: 5,
  //   totalEarnings: 1240.5,
  //   courses: [
  //     { id: 'c1', title: 'React for Beginners', students: 120, price: 39.99 },
  //     { id: 'c2', title: 'Advanced Node.js', students: 85, price: 49.99 },
  //     { id: 'c3', title: 'Data Science 101', students: 60, price: 59.99 },
  //     { id: 'c4', title: 'Intro to Python', students: 200, price: 29.99 },
  //     { id: 'c5', title: 'UX Fundamentals', students: 40, price: 19.99 },
  //   ],
  // };
  const fetchDashboardData = async () => {
     try {
          const token = await getToken();
          const { data } = await axios.get(`${backendURL}/educator/dashboard`, 
            {headers : {Authorization : `Bearer ${token}`}});
          if (data.success) {
            setDashboardData(data.DashboardData);
            console.log(data.DashboardData);
          } else {
            toast.error(data.message);
          }
        } catch (err) {
          toast.error(err.message);
        }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
     
      <div className="space-y-5">
         <h2 className='font-bold'>Dashboard</h2>
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="patients_icon" className='w-10'/>
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.enrolledStudents.length || 0}
              </p>
              <p className="text-base text-gray-500">Total Enrolments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.appointment_icon} alt="patients_icon" className='w-10' />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.totalCourses || 0}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="patients_icon" className='w-10'/>
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.totalEarnings || 0}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrolments</h2>

          <div className="flex flex-col items-center max-w-4xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-500">
                {dashboardData.enrolledStudents.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-500/20"
                  >
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {index + 1}
                    </td>

                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                       
                         src={item.student.imgUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">
                        {item.student.name}
                      </span>
                    </td>

                    <td className="px-4 py-3 truncate">
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