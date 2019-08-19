import React from 'react';
import PropTypes from 'prop-types';
import { GridContainer, GridRow } from '@financial-times/g-components';

const Sticky = ({ activeStep, svgDimensions, children }) => {
  const { width, height } = svgDimensions;

  return (
    <div className="sticky">
      <GridContainer>
        <GridRow>
          <div data-o-grid-colspan="12 S11 Scenter">
            <div className="graphic-container">
              <div className="graphic-placeholder" style={{ width, height, display: "flex", alignItems: "center" }}>
                {/* <h2>
                  {`Step ${activeStep}`}
                </h2>
                <h2>
                  {`SVG dimensions: width ${width}, height ${height}`}
                </h2> */}
                {children}
              </div>
            </div>
          </div>
        </GridRow>
      </GridContainer>
    </div>
  );
};

Sticky.propTypes = {
  activeStep: PropTypes.number.isRequired,
  svgDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

export default Sticky;
