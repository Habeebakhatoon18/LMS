import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const FAQSection = () => {
  const { faqs, navigate } = React.useContext(AppContext);
  const [openFAQs, setOpenFAQs] = useState(new Set());

  const toggleFAQ = (id) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(id)) {
      newOpenFAQs.delete(id);
    } else {
      newOpenFAQs.add(id);
    }
    setOpenFAQs(newOpenFAQs);
  };

  return (
    <section
      id="faq"
      className="py-20  from-emerald-50 to-lime-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left Side */}
          <div>
            {/* Section Header */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="font-medium">Faq Hub</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions!
              </h2>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h3>

              <p className="text-gray-600 mb-6">
                <span className="underline cursor-pointer hover:text-emerald-700 transition-colors">
                  Contact Us
                </span>{' '}
                , We are happy to help you
              </p>

              {/* Team Images */}
              <div className="flex -space-x-2 mb-6">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Team member"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Team member"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Team member"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                />
              </div>


            </div>
          </div>

          {/* Right Side - FAQ List */}
          <div className="space-y-4">
            {faqs && faqs.length > 0 ? (
              faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {openFAQs.has(faq.id) ? (
                      <X className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500" />
                    )}
                  </button>

                  {/* Answer */}
                  {openFAQs.has(faq.id) && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No FAQs available at the moment.
                </p>
              </div>
            )}
            {/* } */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
