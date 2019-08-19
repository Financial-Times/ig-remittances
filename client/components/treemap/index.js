/**
 * @file
 * Treemap component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';
import { treemap, treemapResquarify, hierarchy as createHierarchy } from 'd3-hierarchy';
import { diverging_3 as colors } from 'g-chartcolour';
import { OTHER_CATEGORY_LABEL } from '../../util/constants';

// import
const Treemap = ({
  width, height: containerHeight, remittances, selected, zoomed,
}) => {
  const height = containerHeight - 200;
  const maxDepth = zoomed ? Infinity : 1;
  const collapse = (d) => {
    if (d.depth >= maxDepth) {
      d._children = d.children;
      d.children = null;
    }
    if (d.children) {
      d.children.forEach(collapse);
    }
  };

  const country = remittances.find(d => d.name === selected);
  country.children.forEach(collapse);

  const [firstChild] = country.children;

  const hierarchy = createHierarchy(zoomed ? firstChild : country)
    .sum(({ net_mdollars, remainderGdp }) => net_mdollars || remainderGdp)
    .sort((a, b) => (b.net_mdollars || b.remainderGdp) - (a.net_mdollars || a.remainderGdp));
  const leaves = treemap()
    .tile(treemapResquarify)
    .size([width, height])
    .padding(1)
    .round(true)(hierarchy)
    .leaves();

  const transitions = useTransition(leaves, d => d.data.name, {
    from: ({ x1, y1 }) => ({ transform: [x1, y1, 0] }),
    update: ({ x0, y0 }) => ({ transform: [x0, y0, 1] }),
    enter: ({ x0, y0 }) => ({ transform: [x0, y0, 1] }),
    leave: ({ x1, y1 }) => ({ transform: [x1, y1, 0] }),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3>
        {country.name}
      </h3>
      <svg width={width} height={height}>
        <g>
          {transitions.map(({ item: d, props: { transform }, key }) => (
            <animated.g
              key={key}
              transform={transform.interpolate((x, y, scale) => `translate(${x}, ${y}) scale(${scale})`)}
            >
              <rect
                fill={d.data.name === OTHER_CATEGORY_LABEL ? colors[1] : colors[0]}
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
              />
              {d.x1 - d.x0 > 50 ? (
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
              ) : null}
            </animated.g>
          ))}
        </g>
        )
      </svg>
    </div>
  );
};

Treemap.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  remittances: PropTypes.arrayOf(PropTypes.any).isRequired,
};

Treemap.defaultProps = {
  maxDepth: 1,
};

export default Treemap;
