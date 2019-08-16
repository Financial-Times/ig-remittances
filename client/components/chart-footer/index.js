import React from 'react';
import PropTypes from 'prop-types';

const ChartFooter = ({ source, credit }) => (
  <div className="chart-footer">
    <footer className="o-typography-footer">
      Sources:
      {' '}
      {source}
      <br />
      Graphic:
      {' '}
      {credit}
      &nbsp;&nbsp;
      <em>
© FT
      </em>
    </footer>
  </div>
);

ChartFooter.propTypes = {
  source: PropTypes.string.isRequired,
  credit: PropTypes.string.isRequired,
};

export default ChartFooter;
