/**
 * @file
 * Data selector for radial dendrogram
 */

import React, { useContext } from 'react';
import { userStateContext } from '../../state';
import CountryDropdown from './country-dropdown';
import { formatDollars } from '../../util/format-dollars';

// These are countries has no incoming remittance data
const NO_INCOMING_DATA = [
  'American Samoa',
  'Andorra',
  'Bahamas',
  'Bahrain',
  'British Virgin Islands',
  'Brunei',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Channel Islands',
  'Cuba',
  'Equatorial Guinea',
  'Eritrea',
  'Gabon',
  'Gibraltar',
  'Greenland',
  'Guam',
  'Isle of Man',
  'Libya',
  'Liechtenstein',
  'Mauritania',
  'Monaco',
  'Nauru',
  'North Korea',
  'Northern Mariana Islands',
  'Puerto Rico',
  'Republic of Congo',
  'San Marino',
  'Singapore',
  'Somalia',
  'South Sudan',
  'St. Martin (French part)',
  'Turks and Caicos Islands',
  'US Virgin Islands',
  'United Arab Emirates',
  'Zimbabwe',
  'Sint Maarten (Dutch part)',
  'WORLD',
];

const Selector = () => {
  const [state, dispatch] = useContext(userStateContext);
  const { userCountry, remittancesData } = state;
  const countryNames = remittancesData.map(({ name }) => name).filter(d => !NO_INCOMING_DATA.includes(d));
  const highlightCountryData = remittancesData.find(d => d.name === userCountry);
  const formattedTotalDollars = formatDollars(highlightCountryData.totalmdollarsold);
  return (
    <section className="selector">
      <div className="selector__dropdown-holder">
        In 2017, the total remittances
        {' '}
        <CountryDropdown
          countries={countryNames}
          country={userCountry}
          setHighlighted={({ target }) => dispatch({
            type: 'SET_COUNTRY_FILTER',
            target,
          })
          }
        />
        {' '}
        received from other countries was
        {' '}
        <strong className="dollar-total">
          $
          {formattedTotalDollars}
          {' '}
          <span className="gdp-total">
            (
            {highlightCountryData.totalgdppct.toLocaleString('en', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            })}
            % of GDP)
          </span>
        </strong>
      </div>
    </section>
  );
};

Selector.propTypes = {};

Selector.defaultProps = {};

export default Selector;
