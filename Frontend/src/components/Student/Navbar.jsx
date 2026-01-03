import React, { useState, useEffect, useContext } from 'react';
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { isEducator, navigate, fetchUserData, backendURL, setIsEducator, getToken } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator/dashboard');
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(`${backendURL}/educator/update-role`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (user) fetchUserData();
  }, [user, isEducator, fetchUserData]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-emerald-200 shadow-sm">
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* Logo */}
          <div onClick={() => navigate('/')} className="flex items-center space-x-2 cursor-pointer">
            <img
              src="/logo.png"
              alt="logo"
              className="h-16 w-auto rounded-lg object-contain"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <button
                  onClick={becomeEducator}
                  className="text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                </button>
                <button
                  onClick={() => navigate('/my-enrollments')}
                  className="text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  My Enrolments
                </button>
              </>
            ) : (
              <>
                <button
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
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <UserButton />
            ) : (
              <button
                onClick={openSignIn}
                className="sm:block text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
              >
                Join Now
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center text-gray-700 hover:text-emerald-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            {user ? (
              <>
                <button
                  onClick={() => { becomeEducator(); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                </button>
                <button
                  onClick={() => { navigate('/my-enrollments'); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  My Enrolments
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { scrollToSection('courses'); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  Courses
                </button>
                <button
                  onClick={() => { scrollToSection('faq'); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  FAQs
                </button>
                <button
                  onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  Contact
                </button>
                <button
                  onClick={() => { openSignIn(); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-700 hover:text-emerald-700 font-medium transition-colors duration-200"
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
