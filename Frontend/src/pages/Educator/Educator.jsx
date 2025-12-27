import React from 'react'
import { Outlet } from "react-router-dom";
import Edunavbar from '../../components/Educator/Edunavbar';
const Educator = () => {
  return (
    <div>
      <Edunavbar />
          <Outlet />
    </div>
   
  )
}

export default Educator