import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// D3 layout vars
const tree = d3.cluster();
let root;
let map;

// Canvas drawing vars
let ctx;
const line = d3
  .radialLine()
  .curve(d3.curveBundle.beta(0.85))
  .radius(d => d.y)
  .angle(d => d.x);

const RadialDendrogram = (props) => {
  // Props destructuring assignments
  const {
    data, width, height, scale, blurred, highlightCountry,
  } = props;

  // State
  const [rendered, setRendered] = useState(false);

  // Refs
  const canvasRef = useRef(null);

  // Detect canvas support
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas.getContext) {
      ctx = canvas.getContext('2d');

      console.log('Canvas support detected'); // eslint-disable-line no-console
    } else {
      console.log('Canvas support not detected'); // eslint-disable-line no-console
    }
  }, []);

  // Set up D3 dendrogram layout
  useEffect(() => {
    const radius = Math.min(width / 2, height / 2);

    tree.size([2 * Math.PI, radius - 100]);
    root = tree(d3.hierarchy(data));
    map = new Map(root.leaves().map(d => [d.data.country_iso3, d]));
  }, [width, height]);

  // Draw dendrogram
  useEffect(() => {
    if (rendered) {
      ctx.clearRect(-width / 2, -height / 2, width, height);
    } else {
      ctx.scale(scale, scale);
      ctx.translate(width / 2, height / 2);
      ctx.globalCompositeOperation = 'multiply';
      line.context(ctx);
    }

    // Draw leaf labels
    root.leaves().forEach((leaf) => {
      const {
        x,
        y,
        data: { country_name },
      } = leaf;

      ctx.save();
      ctx.rotate(x - Math.PI / 2);
      ctx.translate(y, 0);

      if (x >= Math.PI) {
        ctx.textAlign = 'right';
        ctx.rotate(Math.PI);
        ctx.translate(-3, 0);
      } else {
        ctx.textAlign = 'left';
        ctx.translate(3, 0);
      }

      ctx.fillText(country_name, 0, 3);
      ctx.restore();
    });

    // Draw connections
    root.leaves().forEach((leaf) => {
      const { country_iso3, sources } = leaf.data;

      if (country_iso3 === highlightCountry) {
        ctx.strokeStyle = 'rgba(255, 117, 163, 1)';
      } else {
        ctx.strokeStyle = 'rgba(217, 204, 195, 0.1)';
      }

      sources.forEach((source) => {
        const sourceNode = map.get(source);

        if (sourceNode) {
          // const group = targetNode.parent.data.group_name;

          ctx.beginPath();
          line(leaf.path(sourceNode));
          ctx.stroke();
        }
      });

      setRendered(true);
    });

    return () => ctx.clearRect(0, 0, width, height);
  }, [width, height, scale, highlightCountry]);

  return (
    <div className="radial-dendrogram__container">
      {!rendered && (
      <p>
Rendering graphic…
      </p>
      )}

      <canvas
        ref={canvasRef}
        width={width * scale}
        height={height * scale}
        style={{ width: `${width}px`, height: `${height}px` }}
        className={blurred ? 'blurred' : ''}
      />
    </div>
  );
};

RadialDendrogram.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    children: PropTypes.array,
  }).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scale: PropTypes.number,
  blurred: PropTypes.bool.isRequired,
  highlightCountry: PropTypes.string.isRequired,
};

RadialDendrogram.defaultProps = {
  scale: 1,
};

export default RadialDendrogram;
