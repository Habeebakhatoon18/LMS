import React, { use } from 'react'
import {UserButton, useUser} from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Edunavbar = () => {
  const {user} = useUser();
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'> 
      <Link to ='/'> <img src="src/assets/logo.png" alt="logo" className='w-28 lg:w-32' /></Link> <div className='flex ites-center gap-5 text-gray-500 relative'> <p> Hi ! {user? user.firstName : 'developers'}</p>
      {user ? <UserButton/> : <img className='max-w-8' src ='' alt ='img' />}</div>
    </div>
  )
}

export default Edunavbar