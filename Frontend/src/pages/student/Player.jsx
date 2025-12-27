import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Player = () => {
  const { courseId } = useParams();
  const { enrolledCourses } = useContext(AppContext);
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [playerState, setPlayerState] = useState(null);

  const getCourseData = () => {
    const course = (enrolledCourses || []).find(c => c.id === courseId) || null;
    setCourseData(course);
    // set first lesson as active by default
    if (course && course.sections && course.sections.length) {
      const firstSection = course.sections[0];
      if (firstSection && firstSection.lessons && firstSection.lessons.length) {
        setPlayerState({
          sectionId: firstSection.id,
          lesson: firstSection.lessons[0]
        });
        setOpenSection(firstSection.id);
      }
    }
  }

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, enrolledCourses]);

  if (!courseData) return (
    <div style={{padding:20}}>Loading course...</div>
  )

  const handleToggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  }

  const handleSelectLesson = (sectionId, lesson) => {
    setPlayerState({ sectionId, lesson });
  }

  return (
    <div className="flex gap-4 p-2">
      {/* Left: course structure */}
      <div className="w-2/5 max-w-[420px]">
        <div>
          <h3 className="text-base font-semibold mt-0">Course Structure</h3>
          <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
            {courseData.sections && courseData.sections.map(section => (
              <div key={section.id} className="border-b border-gray-100">
                <button onClick={() => handleToggleSection(section.id)} className="w-full text-left px-4 py-3 bg-gray-50 flex justify-between items-center cursor-pointer">
                  <div className="font-semibold">{section.title}</div>
                  <div className="text-sm text-gray-600">{section.lessons ? `${section.lessons.length} lectures` : ''} • {section.totalDuration || ''}</div>
                </button>
                {openSection === section.id && (
                  <div className="px-3 py-2">
                    {section.lessons && section.lessons.map(lesson => {
                      const active = playerState && playerState.lesson && playerState.lesson.id === lesson.id;
                      return (
                        <div key={lesson.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleSelectLesson(section.id, lesson)}
                              aria-label={`Play ${lesson.title}`}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 ${active ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
                            >
                              ▶
                            </button>
                            <div>
                              <div className={`${active ? 'text-sm font-semibold' : 'text-sm font-medium'}`}>{lesson.title}</div>
                              <div className="text-xs text-gray-500">{lesson.duration || ''}</div>
                            </div>
                          </div>
                          <div className="text-sm text-blue-600">Watch</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: player area */}
      <div className="flex-1 flex flex-col items-start">
        <div className="bg-black rounded-md overflow-hidden relative pb-[56.25%] h-0 w-full max-w-[720px] mx-auto">
          {playerState && playerState.lesson ? (
            <iframe
              title={playerState.lesson.title}
              src={playerState.lesson.videoUrl ? playerState.lesson.videoUrl : 'https://www.youtube.com/embed/5qap5aO4i9A'}
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white">No lesson selected</div>
          )}
        </div>
        <div className="flex justify-between items-center mt-3 w-full max-w-[720px] mx-auto">
          <div>
            <div className="text-lg font-extrabold">{playerState?.lesson?.title || 'Lesson'}</div>
            <div className="text-sm text-gray-600">Section: {courseData.sections.find(s=>s.id===playerState?.sectionId)?.title || ''}</div>
          </div>
          <a href="#" className="text-blue-600">Mark Complete</a>
        </div>
      </div>
    </div>
  )
}

export default Player