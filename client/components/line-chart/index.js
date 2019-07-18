import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

const margin = {
  top: 20,
  right: 130,
  bottom: 50,
  left: 35,
};

const HIGHLIGHT = 'Remittances';
const parseDate = d3.timeParse('%Y');

const x = d3.scaleTime();
const y = d3.scaleLinear();
const colour = d3.scaleOrdinal(d3.schemeCategory10);

const xAxis = d3.axisBottom().scale(x);
const yAxis = d3
  .axisLeft()
  .scale(y)
  .ticks(10);

const line = d3.line().curve(d3.curveMonotoneX);
let pathDefinition;

const LineChart = (props) => {
  const { data, width, height } = props;
  const [containerRef, inView] = useInView({ threshold: 1, triggerOnce: true });
  const [linesOpacity, setLinesOpacity] = useState(0);
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const linesRef = useRef(null);

  const keys = d3.keys(data[0]).filter(key => key !== 'year');
  colour.domain(keys);

  const nestedData = keys.map(name => ({
    name,
    label: name.replace(/_/g, ' '),
    values: data.map(d => ({ date: parseDate(d.year), value: +d[name] })),
  }));

  // Draw chart (run only on change to width or height prop)
  useEffect(() => {
    // Configure scales
    x.domain(d3.extent(data, d => parseDate(d.year)));
    x.range([margin.left, width - margin.right]);
    y.domain([
      d3.min(nestedData, c => d3.min(c.values, v => v.value)),
      d3.max(nestedData, c => d3.max(c.values, v => v.value)),
    ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    xAxis.ticks(width < 400 ? 3 : 5);

    // Configure line generator
    line.x(d => x(d.date)).y(d => y(d.value));

    // Let D3 render axes
    d3.select(xAxisRef.current)
      .call(xAxis)
      .select('.domain')
      .remove();
    d3.select(yAxisRef.current)
      .call(yAxis)
      // add unit label for y axis
      .call(g => g
        .select('.tick:last-of-type text')
        .clone()
        .attr('x', 3)
        .attr('text-anchor', 'start')
        .attr('font-weight', 600)
        .text('$ billion'))
      .select('.domain')
      .remove();
  }, [width, height]);

  // Watch for inView changes to transition lines
  useEffect(() => {
    console.log({ inView }); // eslint-disable-line no-console

    // testing transitions with opacity first
    if (inView) {
      d3.select(linesRef.current)
        .transition()
        .duration(2000)
        .attr('opacity', 1)
        .on('end', () => setLinesOpacity(1));
    }

    // const path = d3.select(linesRef.current).selectAll('path')
    // path.each((d, i) => {
    // how to select each path???

    // const sel = d3.select(`#line-${d.name}`);
    // const length = sel.node().getTotalLength();

    // sel.attr('stroke-dasharray', `${length} ${length}`)
    //   .attr('stroke-dashoffset', length)
    //   .transition()
    //     .duration(5000)
    //     .attr('stroke-dashoffset', 0)
    // })
  }, [inView]);

  return (
    <div ref={containerRef} className="line-chart__container">
      <h2>
        {`Line chart 100% in view: ${inView}`}
      </h2>
      <svg ref={svgRef} width={width} height={height}>
        <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={y(0)}
          y2={y(0)}
          fill="none"
          stroke="#000"
          strokeWidth="1px"
          shapeRendering="crispEdges"
          strokeDasharray="3, 3"
        />

        <g ref={linesRef} opacity={linesOpacity}>
          {inView
            && nestedData.map((d) => {
              // generate path definition
              pathDefinition = line(d.values);

              // line label placement
              const labelX = x(d.values[d.values.length - 1].date);
              const labelY = y(d.values[d.values.length - 1].value);

              const currentColour = colour(d.name);

              return (
                <g className="line" key={d.name}>
                  <path
                    id={`line-${d.name}`}
                    d={pathDefinition}
                    fill="none"
                    stroke={currentColour}
                    strokeWidth={d.name === HIGHLIGHT ? '2.5px' : '2px'}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity={d.name === HIGHLIGHT ? 1 : 0.5}
                  />
                  <text
                    className="line-label"
                    transform={`translate(${labelX}, ${labelY})`}
                    x={5}
                    dy={d.name === HIGHLIGHT ? '-.2em' : '.35em'}
                    fill={currentColour}
                    fontWeight={d.name === HIGHLIGHT ? 600 : 400}
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
        </g>
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
