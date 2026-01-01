import { useState, useEffect } from 'react';

export const useVeilDrag = (onComplete) => {
  const [veilPosition, setVeilPosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (veilPosition <= 20 && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newPosition = (e.clientX / window.innerWidth) * 100;
      setVeilPosition(Math.min(Math.max(newPosition, 0), 100));
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, veilPosition]);

  return {
    veilPosition,
    isDragging,
    handleMouseDown
  };
};
