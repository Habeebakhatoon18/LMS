import React from 'react'
import { Outlet } from "react-router-dom";
import Edunavbar from '../../components/Educator/Edunavbar';
import Footer from '../../components/Student/Footer';
import Edusidebar from '../../components/Educator/Edusidebar';

const Educator = () => {
  return (
    <div>
      <Edunavbar />
      <div className='flex '>
        <Edusidebar />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
<Footer />
    </div>

  )
}

export default Educator