import React from 'react';

const WaveDivider = ({ 
  color = '#0ea5e9', 
  height = 100, 
  amplitude = 30,
  position = 'top', // 'top' or 'bottom'
  className = ''
}) => {
  return (
    <div 
      className={`absolute w-full left-0 overflow-hidden z-10 ${
        position === 'top' ? 'top-0 rotate-180' : 'bottom-0'
      } ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        viewBox={`0 0 1200 ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d={`M 0 ${height - amplitude} Q 300 ${height - amplitude * 2} 600 ${height - amplitude} T 1200 ${height - amplitude} L 1200 ${height} L 0 ${height} Z`}
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
