import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const getWidth = () => {
    const width = window.innerWidth && document.documentElement.clientWidth
      ? Math.min(window.innerWidth, document.documentElement.clientWidth)
      : window.innerWidth || document.documentElement.clientWidth;

    return width;
  };
  const getHeight = () => {
    const height = window.innerHeight;

    return height;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: getWidth(), height: getHeight() });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(`Window resize detected: ${windowDimensions.width} x ${windowDimensions.height}`); // eslint-disable-line

  return windowDimensions;
};

export default useWindowDimensions;
