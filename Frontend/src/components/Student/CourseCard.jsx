import { Star, User, BarChart3 } from 'lucide-react';

const CourseCard = ({ course }) => {
  
  const averageRating =
    course.courseRating && course.courseRating.length > 0
      ? course.courseRating.reduce((acc, curr) => acc + curr.rating, 0) /
      course.courseRating.length
      : 0;

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.round(averageRating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:border-lime-400 hover:shadow-xl group">

      {/* Course Image */}
      <div className="relative overflow-hidden ">
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0  from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {course.isPublished === false && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded-lg font-semibold">
            Draft
          </span>
        )}
      </div>

      {/* Course Info */}
      <div className="p-6 flex flex-col justify-between h-full">

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-gray-900  mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200">
          {course.courseTitle}
        </h3>

        {/* Description */}
        <p className="text-blue-900 text-sm md:text-base mb-4 line-clamp-3">
          {course.courseDescription}
        </p>

        {/* Rating + Stats */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-1">
            {renderStars()}
            {course.courseRating && course.courseRating.length > 0 && (
              <span className="text-gray-500 text-sm ml-2">
                ({course.courseRating.length})
              </span>
            )}
          </div>
          <div className="text-lg md:text-2xl font-bold text-blue-900">
            ${course.coursePrice}
          </div>
        </div>

        {/* Badges and Metadata */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {course.featured && (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
            {course.discount > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {course.discount}% Off
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
            <User className="h-4 w-4" />

            <span>{course.enrolledStudents?.length || 0} students</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseCard;

