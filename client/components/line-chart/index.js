import React, { useRef, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';
import ChartHead from '../chart-head';

let width = 300;
let height = 400;
const margin = {
  top: 10,
  right: 8,
  bottom: 22,
  left: 36,
};

const parseDate = d3.timeParse('%Y');

const x = d3.scaleTime();
const y = d3.scaleLinear();
const colour = d3.scaleOrdinal(['#eb5e8d', '#9dbf57', '#70dce6', '#0f5499']);

const xAxis = d3.axisBottom().scale(x);
const yAxis = d3
  .axisLeft()
  .scale(y)
  .ticks(10);

const line = d3.line().curve(d3.curveMonotoneX);
let pathDefinitions;

const LineChart = ({ data, isMobile }) => {
  const [containerRef, inView] = useInView({ threshold: 1, triggerOnce: true });
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const linesRef = useRef(null);

  const keys = d3.keys(data[0]).filter(key => key !== 'year');
  colour.domain(keys);

  const nestedData = keys.map(name => ({
    name,
    values: data.map(d => ({ date: parseDate(d.year), value: +d[name] })),
  }));

  const pathRefs = nestedData.map(() => useRef(null));
  const circleRefs = nestedData.map(() => useRef(null));

  // Draw chart (run only on change to isMobile prop)
  useEffect(() => {
    if (!isMobile) {
      width = 680;
      height = 500;
      margin.top = 20;
      margin.right = 10;
      margin.bottom = 24;
      margin.left = 38;
    } else {
      width = 300;
      height = 400;
      margin.top = 10;
      margin.right = 8;
      margin.bottom = 22;
      margin.left = 36;
    }

    // Configure scales
    x.domain(d3.extent(data, d => parseDate(d.year))).range([margin.left, width - margin.right]);
    y.domain([
      d3.min(nestedData, c => d3.min(c.values, v => v.value)),
      d3.max(nestedData, c => d3.max(c.values, v => v.value)),
    ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    xAxis
      .tickValues(data.map(d => parseDate(d.year)).filter(d => d.getFullYear() % 5 === 0 || d.getFullYear() === 2019))
      .tickFormat((d) => {
        const formatTime = d.getFullYear() === 1990 ? d3.timeFormat('%Y') : d3.timeFormat('%y');

        return formatTime(d);
      });

    // Configure line generator and generate path definitions
    line.x(d => x(d.date)).y(d => y(d.value));
    pathDefinitions = nestedData.map(d => line(d.values));

    // Let D3 render axes
    d3.select(xAxisRef.current)
      .call(xAxis)
      .select('.domain')
      .remove();
    d3.select(yAxisRef.current)
      .call(yAxis)
      .select('.domain')
      .remove();
  }, [isMobile]);

  // Watch for inView changes to transition lines
  useEffect(() => {
    console.log({ inView }); // eslint-disable-line no-console

    if (inView) {
      pathRefs.forEach((d, i) => {
        const sel = d3.select(pathRefs[i].current);
        const length = sel.node().getTotalLength();

        sel
          .attr('visibility', 'visible')
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(3000)
          .attr('stroke-dashoffset', 0)
          .ease(d3.easeLinear);
      });

      circleRefs.forEach((d, i) => {
        const sel = d3.select(circleRefs[i].current);

        sel
          .transition()
          .delay(3000)
          .duration(0)
          .attr('opacity', 1);
      });
    }
  }, [inView]);

  return (
    <div ref={containerRef} className="line-chart__container">
      <ChartHead
        title={(
          <Fragment>
            <span className="pink">
Remittances
            </span>
            {' have overtaken '}
            <span className="blue">
FDI
            </span>
            {', '}
            <span className="teal">
private capital flows
            </span>
            {' and '}
            <span className="green">
aid
            </span>
            {' '}
as the largest inflow of capital to emerging economies
          </Fragment>
)}
        subHead="$bn"
        width={width}
      />

      <svg ref={svgRef} width={width} height={height}>
        <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />

        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />

        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={y(0)}
          y2={y(0)}
          fill="none"
          stroke="#cbc0b6"
          strokeWidth="1px"
          shapeRendering="crispEdges"
        />

        <g ref={linesRef}>
          {inView
            && nestedData.map((d, i) => {
              const currentColour = colour(d.name);

              return (
                <g className="line" key={d.name}>
                  <path
                    id={`line-${d.name}`}
                    d={pathDefinitions[i]}
                    ref={pathRefs[i]}
                    fill="none"
                    stroke={currentColour}
                    strokeWidth="3px"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    visibility="hidden"
                  />

                  <circle
                    ref={circleRefs[i]}
                    cx={x(d.values[d.values.length - 1].date)}
                    cy={y(d.values[d.values.length - 1].value)}
                    r={!isMobile ? 4 : 3.5}
                    fill={currentColour}
                    opacity={0}
                  />
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
  isMobile: PropTypes.bool.isRequired,
};

export default LineChart;
