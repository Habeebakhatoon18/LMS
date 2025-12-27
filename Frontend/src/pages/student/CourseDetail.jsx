import React, { useContext, useEffect } from 'react'
import { Star } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const dummyCourse = {
    id: 'demo-1',
    title: 'Introduction to Web Development (Sample)',
    shortDescription: 'A short hands-on sample course to get you started with web development.',
    description: 'This sample course includes basic HTML, CSS, and JavaScript projects to help you build a foundation.',
    rating: 4.5,
    reviews: 120,
    levels: 3,
    videos: 12,
    duration: '4h 30m',
    image: '/src/assets/logo.png',
    price: '62.99',
    discount: 30,
    highlights: ['Lifetime access with free updates', 'Step-by-step, hands-on project guidance', 'Downloadable resources and source code'],
    students: 2,
    sections: [
      { id: 's1', title: 'Introduction to Data Science', totalDuration: '22 hours', lessons: [{ id: 'l1', title: 'Overview', duration: '10m' }, { id: 'l2', title: 'Setup', duration: '15m' }] },
      { id: 's2', title: 'Machine Learning Basics', totalDuration: '27 hours, 30 minutes', lessons: [{ id: 'l3', title: 'Regression', duration: '30m' }, { id: 'l4', title: 'Classification', duration: '40m' }] },
    ],
  };

  const [course,setCourse] = React.useState(dummyCourse);
  const {allCourses, isEnrolled} = useContext(AppContext);
  const { id } = useParams();
  const [openSection, setOpenSection] = React.useState(null);
  
  useEffect(() => {
    let selected = course;
    if (allCourses && allCourses.length) {
      selected = id ? allCourses.find(c => c.id === id) : allCourses[0];
      if (selected) setCourse(selected);
    }
    document.title = `${(selected && selected.title) || course.title} - SmartLearn`;
  }, [allCourses, id]);

  const ratingStars = () => {
    const r = Math.round(course.rating || 0);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < r ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  }

  
  return (
    <div className="py-12 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
        {/* Left content */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{course.title}</h1>
          <p className="text-lg text-gray-700 mb-2">{course.shortDescription}</p>
          <p className="text-sm text-gray-500 mb-4">{course.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">{ratingStars()}</div>
            <div className="text-blue-600">({course.reviews || 0} rating)</div>
            <div className="text-gray-600">· {course.students || 2} students</div>
            <div className="text-gray-600">· Course by <a className="text-blue-600 underline">Author</a></div>
          </div>

          <h3 className="text-xl font-semibold mb-3">Course Structure</h3>
          <div className="space-y-3 mb-8">
            {(course.sections || []).map(section => (
              <div key={section.id} className="bg-white border rounded-md">
                <button
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="w-full px-4 py-3 flex justify-between items-center text-left"
                >
                  <div className="flex flex-col text-sm">
                    <span className="font-medium">{section.title}</span>
                    <span className="text-gray-500 text-xs">{section.lessons.length} lectures - {section.totalDuration || '—'}</span>
                  </div>
                  <div className="text-sm text-gray-500">{openSection === section.id ? '–' : '+'}</div>
                </button>

                {openSection === section.id && (
                  <div className="px-4 pb-4 pt-2">
                    {section.lessons.map(lesson => (
                      <div key={lesson.id} className="py-2 border-b last:border-b-0">
                        <div className="flex justify-between items-center text-sm">
                          <div>{lesson.title}</div>
                          <div className="text-gray-500 text-xs">{lesson.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-3">Course Description</h3>
          <div className="bg-white p-6 rounded-2xl shadow mb-8">
            <h4 className="font-bold text-lg mb-2">Unlock the Power of Data</h4>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Right card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl p-6 shadow">
            <img src={course.image} alt={course.title} className="w-full h-44 object-cover rounded-md mb-4" />

            <div className="text-sm text-red-500 mb-1">5 days left at this price!</div>
            <div className="flex items-end gap-3 mb-2">
              <div className="text-3xl font-extrabold text-gray-900">${course.price}</div>
              <div className="text-sm text-gray-400 line-through">$89.99</div>
              <div className="ml-auto text-sm text-gray-600">30% off</div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1 text-yellow-400">{ratingStars()}</div>
              <div>{course.rating || 0}</div>
              <div className="border-l pl-3">{course.duration} </div>
              <div className="border-l pl-3">{course.videos} lessons</div>
            </div>

            <button onClick={() => console.log('Enroll clicked')} className="w-full bg-blue-600 text-white py-3 rounded-md font-medium mb-4">{isEnrolled ? 'Enrolled' : 'Enroll Now'}</button>

            <h4 className="font-semibold mb-2">What's in the course?</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              {(course.highlights || []).slice(0,5).map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )

}

export default CourseDetail
