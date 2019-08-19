import React from 'react';
import PropTypes from 'prop-types';

const ChartFooter = ({ source }) => (
  <div className="chart-footer">
    <footer className="o-typography-footer">
      Sources:
      {' '}
      {source}
      <br />
      <em>
© FT
      </em>
    </footer>
  </div>
);

ChartFooter.propTypes = {
  source: PropTypes.string.isRequired,
};

export default ChartFooter;
