import React from 'react';
import CourseCard from './CourseCard';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
const CoursesSection = () => {
  const { courses = [] } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span className="font-medium">Our Courses</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Courses
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From critical skills to technical topics, we support your professional development
            with courses that help you grow and succeed.
          </p>
        </div>

        {/* Courses Grid */}

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg"
            >
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div> */}
        {courses && courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="cursor-pointer">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No courses available at the moment.
            </p>
          </div>
        )
        
        }
        <button onClick={() =>navigate('/courseList')}>Explore more Courses</button>
      </div>
    </section>
  );
};

export default CoursesSection;
