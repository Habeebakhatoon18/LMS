import React, { useContext, useMemo, useState } from 'react'
import CourseCard from '../../components/Student/CourseCard'
import SearchBar from '../../components/Student/SearchBar'
import { AppContext } from '../../context/AppContext'

const CoursesList = () => {
  const { allCourses, navigate } = useContext(AppContext) || {}
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allCourses || []
    return (allCourses || []).filter(c => (c.courseTitle || '').toLowerCase().includes(q))
  }, [allCourses, query])

  return (
    <div className="min-h-screen bg-gray-50/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              All <span className="text-lime-500">Courses</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Showing {filtered?.length || 0} practical, project-based courses.
            </p>
          </div>

          <div className="w-full md:w-96">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block ml-1">
              Search Catalog
            </label>
            <SearchBar data={query} onSearch={(val) => setQuery(val)} />
          </div>
        </div>

        {/* Results Grid */}
        {filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map(course => (
              <div
                onClick={() => navigate(`/course/${course._id}`)}
                key={course._id || course.id}
                className="  transition-transform duration-300 hover:-translate-y-1"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="Open-21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No courses found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search terms to find what you're looking for.</p>
            <button
              onClick={() => setQuery('')}
              className="mt-6 text-lime-600 font-bold hover:text-lime-700 underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesList;