import React, { useRef, useEffect } from 'react';
import useWindowDimensions from '../../hooks/use-window-dimensions';

let ctx;

const ChordDiagram = () => {
  const { width, height } = useWindowDimensions();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas.getContext) {
      ctx = canvasRef.current.getContext('2d');

      console.log('Canvas support detected'); // eslint-disable-line no-console
    } else {
      console.log('Canvas support not detected'); // eslint-disable-line no-console
    }
  }, []);

  useEffect(() => {
    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }, [width, height]);

  return (
    <div className="chord-diagram__container">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default ChordDiagram;
