import React from 'react';
import CourseCard from './CourseCard';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section id="courses" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-lime-100 text-lime-700 rounded-full px-4 py-1.5 mb-6 border border-lime-200">
            <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm uppercase tracking-wider">Our Courses</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
            Featured <span className="text-lime-500">Courses</span>
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From critical skills to technical topics, we support your professional development
            with courses designed to help you grow and succeed.
          </p>
        </div>

        {/* Courses Grid */}
        {allCourses && allCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allCourses.slice(0, 3).map((course) => ( // Showing first 3 as 'featured'
              <div
                key={course._id}
                onClick={() => navigate(`/course/${course._id}`)}
                className="group transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-400 font-medium">
              No courses available at the moment.
            </p>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/courseList')}
            className="px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl active:scale-95 "
          >
            Explore more Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;