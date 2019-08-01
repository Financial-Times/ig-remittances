/**
 * @file
 * Preset selector
 */

import React from 'react';
import PropTypes from 'prop-types';

const Preset = ({
  country, country_iso3, direction, dispatch,
}) => (
  <button
    type="button"
    className="selector__preset"
    onClick={(evt) => {
      evt.preventDefault();
      dispatch({
        type: 'SET_PRESET',
        direction,
        country: country_iso3,
      });
    }}
  >
    How much
    {' '}
    {country}
    {' '}
    {direction}
  </button>
);

Preset.propTypes = {
  dispatch: PropTypes.func.isRequired,
  country: PropTypes.string.isRequired,
  country_iso3: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['sent', 'received']).isRequired,
};

export default Preset;
