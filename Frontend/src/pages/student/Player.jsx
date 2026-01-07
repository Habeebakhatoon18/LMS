import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const StarRating = ({ value, onRate }) => {
  const [hover, setHover] = useState(0);
  const positions = [
  "top-4 left-4",
  "top-4 right-4",
  "bottom-4 left-4",
  "bottom-4 right-4",
];

const [pos, setPos] = useState(0);

useEffect(() => {
  const i = setInterval(() => {
    setPos((p) => (p + 1) % positions.length);
  }, 45000);
  return () => clearInterval(i);
}, []);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`text-xl transition ${star <= (hover || value)
            ? "text-yellow-400"
            : "text-gray-300"
            }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const Player = () => {
  const { courseId } = useParams();
  const {
    enrolledCourses,
    backendURL,
    getToken,
    fetchUserEnrolledCourses,
    user,
  } = useContext(AppContext);

  const [course, setCourse] = useState(null);
  const [openChapter, setOpenChapter] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);


  useEffect(() => {
    const foundCourse = enrolledCourses.find(
      (c) => c._id === courseId
    );

    if (foundCourse) {
      setCourse(foundCourse);

      const userRating = foundCourse.courseRating?.find(
        (r) => r.userId === user?._id
      );
      if (userRating) setInitialRating(userRating.rating);
    }
  }, [enrolledCourses, courseId, user]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendURL}/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) setProgressData(data.progressData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, [courseId]);

  const markComplete = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendURL}/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setProgressData((prev) => ({
          ...prev,
          lectureCompleted: [...(prev?.lectureCompleted || []), lectureId],
        }));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendURL}/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Rating submitted");
        fetchUserEnrolledCourses();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // youtu.be/<id>
    if (url.includes("youtu.be")) {
      return url.split("youtu.be/")[1]?.split("?")[0];
    }

    // youtube.com/watch?v=<id>
    if (url.includes("watch?v=")) {
      return url.split("watch?v=")[1]?.split("&")[0];
    }

    // youtube.com/embed/<id>
    if (url.includes("embed/")) {
      return url.split("embed/")[1]?.split("?")[0];
    }

    return null;
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${backendURL}/courses/${courseId}`,
          { courseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          if (data.course.courseRating?.length > 0) {
            setInitialRating(data.course.courseRating[0].rating);
          }
          // Set the existing rating
        }
      } catch (err) {
        console.error("Error fetching rating:", err);
      }
    };
    if (courseId && user) {
      fetchRating();
    }
  }, [courseId, backendURL, getToken, user]);


  if (!course) return <div className="p-6">Loading course...</div>;
  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 p-4 md:p-6 bg-gray-50 min-h-screen">

      {/*LEFT SIDEBAR  */}
      <aside className="bg-white rounded-xl shadow-sm border flex flex-col w-full lg:w-80 h-auto lg:h-[calc(100vh-3rem)] order-2 lg:order-1">

        <div className="px-4 py-3 border-b sticky top-0 bg-white z-10">
          <h3 className="text-base font-semibold text-gray-800">
            Course Content
          </h3>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto divide-y">
          {course.courseContent.map((chapter) => (
            <div key={chapter.chapterid}>
              <button
                onClick={() =>
                  setOpenChapter(
                    openChapter === chapter.chapterid
                      ? null
                      : chapter.chapterid
                  )
                }
                className="w-full px-4 py-3 flex justify-between hover:bg-gray-50"
              >
                <span className="font-medium text-sm text-gray-800">
                  {chapter.chapterTitle}
                </span>
                <span className="text-xs text-gray-500">
                  {chapter.chapterContent.length} lectures
                </span>
              </button>

              {openChapter === chapter.chapterid && (
                <div className="bg-gray-50 px-2 py-2 space-y-1">
                  {chapter.chapterContent.map((lecture) => {
                    const active =
                      currentLecture?.lectureId === lecture.lectureId;
                    const completed =
                      progressData?.lectureCompleted?.includes(
                        lecture.lectureId
                      );

                    return (
                      <button
                        key={lecture.lectureId}
                        onClick={() =>
                          setCurrentLecture({ ...lecture, chapter })
                        }
                        className={`w-full flex justify-between items-center px-2 py-2 rounded-md text-xs transition
                          ${active
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "hover:bg-white text-gray-700"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px]
                              ${completed
                                ? "bg-green-500 text-white"
                                : "bg-blue-100 text-blue-600"
                              }`}
                          >
                            ▶
                          </span>
                          <span className="truncate ">
                            {lecture.lectureTitle}
                          </span>
                        </div>

                        <span className="text-[10px] text-gray-500">
                          {completed ? "✓" : `${lecture.lectureDuration}m`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RATING */}
        <div className="border-t px-4 py-3 bg-white sticky bottom-0">
          <p className="text-xs text-gray-600 mb-1">
            Rate this course
          </p>
          <StarRating
            value={initialRating}
            onRate={(rating) => {
              setInitialRating(rating);
              handleRate(rating);
            }}
          />
        </div>
      </aside>

      {/* MAIN PLAYER*/}
      <main className="flex-1 space-y-4 order-1 lg:order-2">

        {/* VIDEO */}
        <div className="bg-black rounded-xl overflow-hidden shadow-md w-full">
          {currentLecture ? (
            <div onContextMenu={(e) => e.preventDefault()} className="relative w-full aspect-video">
              {/* YouTube Player */}
              <YouTube
                videoId={currentLecture.youtubeVideoId}
                className="absolute inset-0 w-full h-full"
                iframeClassName="w-full h-full"
                opts={{
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    disablekb: 1,
                    fs: 1,
                  },
                }}
              />

              {/* Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <span className={`absolute ${positions[pos]}  opacity-40 text-sm bg-black/30 px-2 py-1 rounded`}>
                  {user.email}
                </span>
              </div>
            </div>

          ) : (
            <div className="aspect-video flex items-center justify-center">
              <img
                src={course.courseThumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* INFO + COMPLETE */}
        {currentLecture && (
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                {currentLecture.lectureTitle}
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                {currentLecture.chapter.chapterTitle}
              </p>
            </div>
            {(() => {
              const isCompleted = progressData?.lectureCompleted?.includes(currentLecture.lectureId);
              return (
                <button
                  onClick={() => markComplete(currentLecture.lectureId)}
                  className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition whitespace-nowrap
            ${isCompleted
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  {isCompleted ? "Completed" : "Mark Complete"}
                </button>
              );
            })()}

          </div>
        )}
      </main>
    </div>
  );
};

export default Player;
