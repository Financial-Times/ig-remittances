import React from 'react';
import PropTypes from 'prop-types';
import { GridContainer, GridRow } from '@financial-times/g-components';

const Sticky = ({ children }) => (
  <div className="sticky">
    <GridContainer>
      <GridRow>
        <div data-o-grid-colspan="12 S11 Scenter">
          <div className="graphic-container">
            {children}
          </div>
        </div>
      </GridRow>
    </GridContainer>
  </div>
);

Sticky.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sticky;
