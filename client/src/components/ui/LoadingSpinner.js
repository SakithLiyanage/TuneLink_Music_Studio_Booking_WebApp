import React from 'react';

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
    <div className="text-primary-600 font-medium">{text}</div>
  </div>
);

export default LoadingSpinner;
