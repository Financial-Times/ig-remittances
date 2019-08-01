/**
 * @file
 * Dropdown input for user selector
 */

import React from 'react';
import PropTypes from 'prop-types';

const DirectionDropdown = ({ setDirection, direction }) => (
  <span className="o-forms-input o-forms-input--select">
    <select className="selector__dropdown selector__dropdown--direction" value={direction} onChange={setDirection}>
      <option value="sent">
sent to
      </option>
      <option value="received">
received from
      </option>
    </select>
  </span>
);

DirectionDropdown.propTypes = {
  direction: PropTypes.oneOf(['sent', 'received']).isRequired,
  setDirection: PropTypes.func.isRequired,
};

export default DirectionDropdown;
