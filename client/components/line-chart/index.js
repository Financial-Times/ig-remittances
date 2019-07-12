import React from 'react';
import { useInView } from 'react-intersection-observer';

const LineChart = () => {
  const [chartRef, inView] = useInView({ threshold: 1 });

  if (inView) {
    console.log('Line chart in view'); // eslint-disable-line no-console
  }

  return (
    <div ref={chartRef} className="line-chart__container">
      <h2>
        {`Line chart in view: ${inView}`}
      </h2>
    </div>
  );
};

export default LineChart;
