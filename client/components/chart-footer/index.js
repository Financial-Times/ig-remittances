import React from 'react';
import PropTypes from 'prop-types';

const ChartFooter = ({ source, credit, width }) => (
  <div className="chart-footer" style={{ width: `${width}px` }}>
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
  credit: PropTypes.element.isRequired,
  width: PropTypes.number.isRequired,
};

export default ChartFooter;
