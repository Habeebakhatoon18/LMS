import React from 'react'
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Edusidebar = () => {
  const {isEducator} = useContext(AppContext);
   //to be replaced with context
  const menuItems = [
    { name: 'Dashboard', path : '/educator/dashboard' },
    { name: ' Add Courses', path: '/educator/add courses' },
    { name: 'My courses Course', path: '/educator/create-course' },
    { name: 'students enrolled', path: '/educator/profile' },
  ];
  return isEducator && (
   (
    <div>
      {menuItems.map((item) =>{
        <NavLink to={item.path}>{item.name}</NavLink>
      })}r</div>
  )
)}

export default Edusidebar