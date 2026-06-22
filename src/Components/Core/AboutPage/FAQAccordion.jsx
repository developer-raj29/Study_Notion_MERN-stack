import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

const faqData = [
  {
    question: "What is Study Notion?",
    answer: "Study Notion is a fully-fledged EdTech platform that enables instructors to create educational content and students to consume it. We focus on providing high-quality courses across various tech disciplines.",
  },
  {
    question: "How do I access my purchased courses?",
    answer: "Once you purchase a course, you can find it under the 'Enrolled Courses' section in your Student Dashboard. You'll have lifetime access to any course you purchase.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We support a wide variety of payment methods including credit/debit cards, UPI, net banking, and popular wallets, all processed securely via Razorpay.",
  },
  {
    question: "Are there any prerequisites for the courses?",
    answer: "Prerequisites vary by course. Beginner courses require no prior knowledge, while advanced courses might expect familiarity with certain languages or frameworks. Check the individual course details for specific requirements.",
  },
  {
    question: "Do you provide certificates upon completion?",
    answer: "Yes! Once you complete 100% of a course's video materials and any required assignments, a verifiable certificate of completion will be automatically generated for you.",
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto w-11/12 max-w-maxContent my-20">
      <h2 className="text-center text-4xl font-semibold text-richblack-5 mb-10">
        Frequently Asked <span className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text">Questions</span>
      </h2>
      
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className="border border-richblack-600 rounded-lg bg-richblack-800 overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center p-5 text-left text-richblack-5 font-medium hover:bg-richblack-700 transition-colors"
            >
              <span className="text-lg">{faq.question}</span>
              <div 
                className={`flex-shrink-0 text-richblack-300 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-caribbeangreen-100" : "rotate-0"
                }`}
              >
                <HiOutlineChevronDown className="w-6 h-6" />
              </div>
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 pt-0 text-richblack-300 border-t border-richblack-600 mt-2">
                <p className="mt-3">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
