"use client";

import React from 'react';

const FilloutConsultation = () => {
  return (
    <div className="mt-16 p-8 md:p-10 bg-blue-50 dark:bg-blue-950 rounded-lg shadow-sm text-center border border-blue-100 dark:border-blue-900">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Ready to Transform Your Care?</h2>
      <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Contact us today for a free consultation and discover how Focus Care can elevate your services.
      </p>
      <a
        href="/contact"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 md:py-3 md:px-8 rounded-lg transition duration-300 ease-in-out hover:shadow-md"
      >
        Schedule Your Free Consultation
      </a>
    </div>
  );
};

export default FilloutConsultation;
