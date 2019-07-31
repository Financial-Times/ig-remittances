/**
 * @file
 * Dropdown input for user selector
 */

import React from 'react';
import PropTypes from 'prop-types';

const DirectionDropdown = ({ setDirection, direction }) => (
  <select value={direction} type="select" onChange={setDirection}>
    <option value="sent">
sent to
    </option>
    <option value="received">
received from
    </option>
  </select>
);

DirectionDropdown.propTypes = {
  direction: PropTypes.oneOf(['sent', 'received']).isRequired,
  setDirection: PropTypes.func.isRequired,
};

export default DirectionDropdown;
