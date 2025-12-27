import React, { useContext, useMemo, useState } from 'react'
import CourseCard from '../../components/Student/CourseCard'
import SearchBar from '../../components/Student/SearchBar'
import { AppContext } from '../../context/AppContext'

const CoursesList = () => {
  const { courses = [] } = useContext(AppContext) || {}
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return courses
    return courses.filter(c => (c.title || '').toLowerCase().includes(q))
  }, [courses, query])

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
          <div className="w-full sm:w-80">
            <SearchBar data={query} onSearch={(val) => setQuery(val)} />
          </div>
        </div>

        {filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesList