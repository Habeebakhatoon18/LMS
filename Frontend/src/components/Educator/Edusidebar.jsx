import React from 'react'
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const Edusidebar = () => {
  const { isEducator } = useContext(AppContext);
  //to be replaced with context
  const menuItems = [
    { name: 'Dashboard', path: '/educator/dashboard' },
    { name: 'Add Courses', path: '/educator/add-course' },
    { name: 'My Course', path: '/educator/my-courses' },
    { name: 'Students enrolled', path: '/educator/students-enroll/:courseId' },
  ];
  return isEducator && (
    (
      <div>
        {menuItems.map((item) => {
          return (
          <NavLink to={item.path}
            key={item.name}
            end={item.path === '/educator'} className={({ isActive }) => isActive ? 'flex  items-center gap-2 bg-gray-200 py-4 md:px-6 rounded-lg text-blue-600' : 'flex  items-center gap-2 hover:bg-gray-100 py-4 md:px-6 rounded-lg text-gray-600'}>
            <img src="item.icon" alt="item icon" className='w-6 h-6' />
            <p className='md:block hidden text-center'>{item.name}</p>
          </NavLink>
        )})}</div>
    )
  )
}

export default Edusidebar