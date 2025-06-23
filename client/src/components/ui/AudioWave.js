import React, { useState, useEffect } from 'react';

const AudioWave = () => {
  const [bars, setBars] = useState([]);
  
  useEffect(() => {
    // Generate random bars for visualization
    const barCount = 30;
    const generateBars = () => {
      return Array.from({ length: barCount }, () => Math.floor(Math.random() * 50) + 10);
    };
    
    setBars(generateBars());
    
    // Animate bars
    const interval = setInterval(() => {
      setBars(generateBars());
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-center h-16 space-x-1 px-4">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 bg-gradient-to-t from-primary-600 to-primary-300 rounded-t-sm"
          style={{ 
            height: `${height}%`,
            transition: 'height 0.2s ease-in-out'
          }}
        ></div>
      ))}
    </div>
  );
};

export default AudioWave;
