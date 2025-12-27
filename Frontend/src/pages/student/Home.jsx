import React from 'react'
import Navbar from '../../components/Student/Navbar.jsx'
import Hero from '../../components/Student/Hero.jsx'
import CoursesSection from '../../components/Student/CourseSection.jsx'
import FAQSection from '../../components/Student/Faq.jsx'
import CallToAction from '../../components/Student/CallToAction.jsx'
import Footer from '../../components/Student/Footer.jsx'
const Home = () => {
  return (
    <div>
      <Navbar/>
<Hero />
<CoursesSection />
<FAQSection />
<CallToAction />
<Footer />
    </div>
  )
}

export default Home