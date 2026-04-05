import React, { useEffect, useState } from 'react';

export const AnimatedCounter = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const endValue = parseFloat(value);
    
    if (endValue === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // using easeOutQuart easing for a smoother finish
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      setCount(easeOut * endValue);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{Math.round(count).toLocaleString('en-IN')}</span>;
};
