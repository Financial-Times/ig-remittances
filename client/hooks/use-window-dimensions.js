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

  const handleResize = () => {
    setWindowDimensions({ width: getWidth(), height: getHeight() });
    console.log(`Window resize detected: ${getWidth()} x ${getHeight()}`); // eslint-disable-line
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
