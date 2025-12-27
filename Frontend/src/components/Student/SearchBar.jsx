import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data, onSearch }) => {
  const navigate = useNavigate();

  const [input, setInput] = useState(data ? data : '')

  useEffect(() => {
    setInput(data ? data : '')
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch && typeof onSearch === 'function') {
      onSearch(input)
      return
    }
    navigate('/courseList/' + input)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center w-full rounded-md border border-emerald-200 bg-white shadow-sm transition-colors focus-within:ring-2 focus-within:ring-emerald-300">
          {/* Search icon */}
          <div className="flex items-center justify-center px-3 text-emerald-600 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>

          <input
            id="search"
            type="search"
            name="search"
            value={input}
            onInput={(e) => {
              setInput(e.target.value)
              if (onSearch && typeof onSearch === 'function') onSearch(e.target.value)
            }}
            placeholder="Search courses..."
            aria-label="Search courses"
            className="w-full px-2 py-2 text-sm md:text-base placeholder-blue-400 text-blue-700 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            aria-label="Submit search"
            className="hidden sm:inline-flex items-center px-3 py-2 mr-1 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-md transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar