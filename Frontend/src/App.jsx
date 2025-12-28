import { Routes, Route } from "react-router-dom";

import Educator from "./pages/Educator/Educator.jsx";
import MyCourses from "./pages/Educator/MyCourses.jsx";
import AddCourse from "./pages/Educator/AddCourse.jsx";
import StudentsEnroll from "./pages/Educator/StudentsEnroll.jsx";
import Dashboard from "./pages/Educator/Dashboard.jsx";
import Navbar from "./components/Student/Navbar.jsx";
import CourseDetail from "./pages/student/CourseDetail.jsx";

import Home from "./pages/student/Home.jsx";
import MyEnrolment from "./pages/student/MyEnrolment.jsx";
import Player from "./pages/student/Player.jsx";
import CoursesList from "./pages/student/CoursesList.jsx";
import Loading from "./components/Student/Loading.jsx";
import 'quill/dist/quill.snow.css';
const App = () => {
  return (
    <Routes>

      {/* Student routes */}
      <Route path="/" element={<Home />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/my-enrolments" element={<MyEnrolment />} />
      <Route path="/player/:courseId" element={<Player />} />
      <Route path="/courseList" element={<CoursesList />} />
      <Route path="/courseList/:input" element={<CourseDetail />} />
      <Route path="/loading/:path" element={<Loading />} />

      {/* Educator routes */}
      <Route path="/educator" element={<Educator />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="students-enroll/:courseId" element={<StudentsEnroll />} />
        <Route path="add-course" element={<AddCourse />} />
      </Route>

    </Routes>
  );
};

export default App;
