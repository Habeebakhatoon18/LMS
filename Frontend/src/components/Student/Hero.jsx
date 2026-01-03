import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative pt-28 min-h-screen bg-gradient-to-br from-emerald-300 via-lime-300 to-emerald-500 overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-300/20 rounded-full"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-20 hidden lg:block">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <CheckCircle className="h-5 w-5 text-black" />
            <span className="text-black font-medium">
              Trusted by 20,000+ Happy Learners
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black mb-6 leading-tight">
            Learn EverGreen Skills{' '}
            <br className="hidden sm:block" />
            <span className="block">Online, Anywhere, Anytime.</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed">
            Practical project-based courses that are easy to understand, straight to the
            point, and distraction-free while ensuring comprehensive learning.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/courseList')}
              className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              View All Courses
            </button>

            {/* limit search width so it doesn't stretch too far */}
            
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
