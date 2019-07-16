import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

const margin = {
  top: 20,
  right: 105,
  bottom: 30,
  left: 50,
};

const HIGHLIGHT = 'Remittances';

const parseDate = d3.timeParse('%Y');

const x = d3.scaleTime();
const y = d3.scaleLinear();
const colour = d3.scaleOrdinal(d3.schemeCategory10);

const xAxis = d3.axisBottom()
  .scale(x)
  .ticks(5);
const yAxis = d3.axisLeft()
  .scale(y)
  .ticks(10);

const line = d3.line()
  .curve(d3.curveMonotoneX);
let pathDefinition;

const LineChart = (props) => {
  const { data, testdata, width, height } = props;
  const [containerRef, inView] = useInView({ threshold: 1, triggerOnce: true });
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  const keys = d3.keys(testdata[0]).filter(key => key != 'year');
  colour.domain(keys);

  const nestedData = keys.map(name => {
    return {
      name,
      label: name.replace(/_/g, ' '),
      values: testdata.map(d => {
        return {date: parseDate(d.year), value: +d[name]};
      })
    }
  })

  // Draw chart (run only on change to width or height prop)
  useEffect(() => {
    // Configure scales
    x.domain(d3.extent(testdata, d => parseDate(d.year)))
      x.range([margin.left, width - margin.right]);
    y.domain([
      d3.min(nestedData, c => d3.min(c.values, v => v.value)),
      d3.max(nestedData, c => d3.max(c.values, v => v.value))
    ]).nice()
      .range([height - margin.bottom, margin.top]);

    // Configure line generator
    line.x(d => x(d.date))
      .y(d => y(d.value));

    // Let D3 render axes
    d3.select(xAxisRef.current).call(xAxis).select('.domain').remove();
    d3.select(yAxisRef.current).call(yAxis).select('.domain').remove();
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
        { nestedData.map((d) => {
          // generate path definition
          pathDefinition = line(d.values);
          return (
            <path
              key={d.name}
              d={pathDefinition}
              fill="none"
              stroke="steelblue"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )
        })
        }
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
