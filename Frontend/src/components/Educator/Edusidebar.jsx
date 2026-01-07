import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { FaPlusCircle } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';

const Edusidebar = () => {
  const { isEducator } = useContext(AppContext);
  
  const menuItems = [
  { name: 'Dashboard', path: '/educator/dashboard', icon: MdDashboard },
  { name: 'Add Courses', path: '/educator/add-course', icon: FaPlusCircle },
  { name: 'My Course', path: '/educator/my-courses', icon: FaBookOpen },
  { name: 'Students enrolled', path: '/educator/students-enroll', icon: FaUsers },
];

  return isEducator && (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 p-2 md:p-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-0">
      {menuItems.map((item) => {
        return (
          <NavLink 
            to={item.path}
            key={item.name}
            end={item.path === '/educator'} 
            className={({ isActive }) => 
              isActive 
                ? 'flex items-center gap-2 bg-gray-200 py-3 px-4 md:px-6 rounded-lg text-blue-600 whitespace-nowrap' 
                : 'flex items-center gap-2 hover:bg-gray-100 py-3 px-4 md:px-6 rounded-lg text-gray-600 whitespace-nowrap'
            }
          >
            <item.icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <p className='text-sm md:text-base'>{item.name}</p>
          </NavLink>
        )
      })}
    </div>
  )
}

export default Edusidebar