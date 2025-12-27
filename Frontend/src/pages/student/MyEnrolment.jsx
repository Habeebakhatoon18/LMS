import React from 'react'
import { AppContext } from '../../context/AppContext'

const MyEnrolment = () => {
  const { enrolledCourses, navigate } = React.useContext(AppContext);

  const fallback = [
    {
      id: 'c1',
      title: 'Introduction to JavaScript',
      image: '/src/assets/logo.png',
      duration: '1 hour, 5 minutes',
      completed: 2,
      totalLectures: 4,
      status: 'On Going'
    },
    {
      id: 'c2',
      title: 'Advanced Python Programming',
      image: '/src/assets/logo.png',
      duration: '57 hours',
      completed: 1,
      totalLectures: 5,
      status: 'On Going'
    },
    {
      id: 'c3',
      title: 'Web Development Bootcamp',
      image: '/src/assets/logo.png',
      duration: '49 hours, 30 minutes',
      completed: 4,
      totalLectures: 4,
      status: 'Completed'
    }
  ];

  const rows = (enrolledCourses && enrolledCourses.length) ? enrolledCourses : fallback;

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-6">My Enrollments</h2>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate ? navigate(`/player/${c.id}`) : null}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                    <img src={c.image} alt={c.title} className="w-24 h-16 object-cover rounded-sm" />
                    <div className="text-sm text-gray-700">{c.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.duration || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{(c.completed ?? 0)} / {c.totalLectures || '—'} Lectures</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex justify-end">
                      <button className={`px-4 py-1 rounded-md text-white text-sm ${c.status === 'Completed' ? 'bg-blue-700' : 'bg-blue-600'}`} onClick={(e) => { e.stopPropagation(); /* handle status click if needed */ }}>{c.status}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyEnrolment