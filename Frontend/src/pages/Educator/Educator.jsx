import React from 'react'
import { Outlet } from "react-router-dom";
import Edunavbar from '../../components/Educator/Edunavbar';
import Footer from '../../components/Student/Footer';
import Edusidebar from '../../components/Educator/Edusidebar';

const Educator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Edunavbar />
      <div className='flex flex-col lg:flex-row flex-1'>
        <Edusidebar />
        <div className='flex-1 overflow-x-hidden'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>

  )
}

export default Educator