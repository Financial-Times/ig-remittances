import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};
const x = d3.scaleLinear();
const y = d3.scaleLinear();
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);
const line = d3.line();
let pathDefinition;

const LineChart = (props) => {
  const { data, width, height } = props;
  const [containerRef, inView] = useInView({ threshold: 1, triggerOnce: true });
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  // Draw chart (run only on change to width or height prop)
  useEffect(() => {
    // Configure scales
    x.domain([0, data.length - 1]).range([margin.left, width - margin.right]);
    y.domain([0, d3.max(data)]).range([height - margin.bottom, margin.top]);

    // Configure axes
    xAxis.ticks(data.length - 1);

    // Configure line generator and generate path definition
    line.x((d, i) => x(i)).y(d => y(d));
    pathDefinition = line(data);

    // Let D3 render axes
    d3.select(xAxisRef.current).call(xAxis);
    d3.select(yAxisRef.current).call(yAxis);
  }, [width, height]);

  if (inView) {
    console.log('Line chart in view'); // eslint-disable-line no-console
  }

  return (
    <div ref={containerRef} className="line-chart__container">
      <h2>
        {`Line chart 100% in view: ${inView}`}
      </h2>

      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
        <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
        {inView && (
          <path
            d={pathDefinition}
            fill="none"
            stroke="steelblue"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default LineChart;
