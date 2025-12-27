import React from 'react';
import { Star, BarChart3 } from 'lucide-react';

const CourseCard = ({ course }) => {

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < course.rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

 

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Course Content */}
      <div className="p-6">

        {/* Rating and Price */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-1">
            {renderStars()}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${course.price}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Badges */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {course.featured && (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseCard;
