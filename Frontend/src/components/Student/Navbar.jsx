import React, { useState } from 'react';
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';

const Header = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { isEducator, navigate, fetchUserData, backendURL, setIsEducator, getToken } = useContext(AppContext);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator/dashboard');
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(backendURL + '/educator/update-role', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (user)
      fetchUserData();
  }, [user, isEducator]);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-emerald-200 shadow-sm">
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="src/assets/logo.png"
              alt="logo"
              className="h-16 w-auto rounded-lg object-contain"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? <>
              <button
                onClick={becomeEducator}
                className="text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                {isEducator ?
                  <span>Educator Dashboard</span> : <span> Become Educator</span>}
              </button>
              <button
                onClick={() => navigate('/my-enrolments')}
                className="text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                My Enrolments
              </button>  </> :
              <> <button
                onClick={() => scrollToSection('courses')}
                className="text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Courses
              </button>

                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  FAQs
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  Contact
                </button>
              </>
            }
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {user ? <UserButton /> :
              <button
                onClick={() => openSignIn()}
                className="sm:block text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Join Now
              </button>
            }

          </div>

        </div>


      </nav>
    </header>
  );
};

export default Header;
