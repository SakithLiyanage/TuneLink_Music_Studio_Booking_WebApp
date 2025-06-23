import React from 'react';
import Wave from 'react-wavify';

const WaveDivider = ({ 
  color = '#0ea5e9', 
  height = 100, 
  amplitude = 30,
  speed = 0.15,
  points = 5,
  position = 'top', // 'top' or 'bottom'
  className = ''
}) => {
  return (
    <div 
      className={`absolute w-full h-[${height}px] left-0 overflow-hidden z-10 ${
        position === 'top' ? 'top-0 rotate-180' : 'bottom-0'
      } ${className}`}
      style={{ height: `${height}px` }}
    >
      <Wave 
        fill={color}
        paused={false}
        options={{
          height: amplitude,
          amplitude: amplitude,
          speed: speed,
          points: points
        }}
      />
    </div>
  );
};

export default WaveDivider;
