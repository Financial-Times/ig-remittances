/**
 * @file
 * Treemap component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';
import { treemap, treemapResquarify, hierarchy as createHierarchy } from 'd3-hierarchy';
import { categorical_bar } from 'g-chartcolour';
import Country from '@financial-times/countries';
import Selector from '../selector';
import { OTHER_CATEGORY_LABEL } from '../../util/constants';
import ChartHead from '../chart-head';
import ChartFooter from '../chart-footer';
import abbr from '../../util/formatted-names';
import { formatDollars } from '../../util/format-dollars';

const colors = [categorical_bar[4], categorical_bar[5]];

const Treemap = ({
  width, height: containerHeight, remittances, selected, zoomed, showSelector,
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
  const countryFormattedName = (() => {
    try {
      return new Country(country.code).name;
    } catch (e) {
      return country.name;
    }
  })();
  country.children.forEach(collapse);

  const [firstChild] = country.children;

  const hierarchy = createHierarchy(zoomed ? firstChild : country)
    .sum(({ totalmdollarsold, remainderGdp }) => totalmdollarsold || remainderGdp)
    .sort((a, b) => (b.totalmdollarsold || b.remainderGdp) - (a.totalmdollarsold || a.remainderGdp));

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
      {showSelector && <Selector />}
      {!showSelector && (
        <ChartHead
          title={
            !zoomed
              ? `Remittances as a proportion of ${countryFormattedName}’s economy`
              : `Sources of remittances received by ${countryFormattedName}`
          }
          subHead="$m"
          width={width}
        />
      )}

      <svg width={width} height={height}>
        <g>
          {transitions.map(({ item: d, props: { transform }, key }) => (
            <animated.g
              key={key}
              transform={transform.interpolate((x, y, scale) => `translate(${x}, ${y}) scale(${scale})`)}
            >
              <rect
                fill={d.data.name === OTHER_CATEGORY_LABEL ? colors[1] : '#f65d8b'}
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
                id={`rect-${key}`}
              />
              <clipPath id={`clip-${key}`}>
                <use href={`#rect-${key}`} />
              </clipPath>
              {d.x1 - d.x0 > 50 ? (
                <text fill="white" clipPath={`url(#clip-${key})`}>
                  {// I'm sorry, this code makes me cry too. :'(
                  (d.data.name === OTHER_CATEGORY_LABEL
                    ? [d.data.name]
                    : (() => {
                      try {
                        return abbr(new Country(d.data.code).name);
                      } catch (e) {
                        return d.data.name;
                      }
                    })().split(/(?=[A-Z][^A-Z])/g)
                  )
                    .concat(d.value)
                    .map((line, i, nodes) => (
                      <tspan x={3} y={`${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`}>
                        {i === nodes.length - 1 ? `$${formatDollars(line)}` : line}
                      </tspan>
                    ))}
                </text>
              ) : null}
            </animated.g>
          ))}
        </g>
        )
      </svg>
      <ChartFooter sources={['World Bank']} width={width} />
    </div>
  );
};

Treemap.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  remittances: PropTypes.arrayOf(PropTypes.any).isRequired,
  showSelector: PropTypes.bool,
  selected: PropTypes.string.isRequired,
  zoomed: PropTypes.bool.isRequired,
};

Treemap.defaultProps = {
  showSelector: false,
};

export default Treemap;
