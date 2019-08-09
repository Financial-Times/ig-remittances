/**
 * @file
 * Treemap component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { treemap } from 'd3-hierarchy';
import { categorical_bar as colors } from 'g-chartcolour';

// import
const Treemap = ({
  width, height, hierarchies, maxDepth,
}) => {
  const collapse = (d) => {
    if (d.depth >= maxDepth) {
      d._children = d.children;
      d.children = null;
    }
    if (d.children) {
      d.children.forEach(collapse);
    }
  };

  const tree = treemap()
    .size([width, height])
    .padding(1)
    .round(true);

  const sorted = [...hierarchies].slice(7).sort((a, b) => b.value - a.value);

  sorted.forEach(collapse);
  const roots = sorted.map(tree);

  return roots.map((root, i) => (
    <svg width={width} height={height}>
      <g>
        {root.leaves().map(d => (
          <g transform={`translate(${d.x0}, ${d.y0})`}>
            <rect fill={colors[i]} width={d.x1 - d.x0} height={d.y1 - d.y0} />
            <text>
              {d.data.name
                .split(/(?=[A-Z][^A-Z])/g)
                .concat(d.value)
                .map((line, i, nodes) => (
                  <tspan x={3} y={`${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`}>
                    {line}
                  </tspan>
                ))}
            </text>
          </g>
        ))}
      </g>
      )
    </svg>
  ));
};

Treemap.propTypes = {
  maxDepth: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  hierarchies: PropTypes.arrayOf(PropTypes.any).isRequired,
};

Treemap.defaultProps = {
  maxDepth: 1,
};

export default Treemap;
