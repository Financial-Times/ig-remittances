import React from 'react';
import PropTypes from 'prop-types';

const ChartFooter = ({ sources }) => (
  <div className="chart-footer">
    <footer className="o-typography-footer">
      {sources.length > 1 ? 'Sources: ' : 'Source: '}

      {sources.map((s, i) => (sources.length > 1 && i < sources.length - 1 ? `${s}; ` : s))}

      <br />

      <em>
© FT
      </em>
    </footer>
  </div>
);

ChartFooter.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ChartFooter;
