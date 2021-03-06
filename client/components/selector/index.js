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
  'French Polynesia',
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
  'New Caledonia',
  'North Korea',
  'Northern Mariana Islands',
  'Puerto Rico',
  'Republic of Congo',
  'San Marino',
  'Singapore',
  'Sint Maarten (Dutch part)',
  'Somalia',
  'South Sudan',
  'St. Martin (French part)',
  'Turks and Caicos Islands',
  'US Virgin Islands',
  'United Arab Emirates',
  'Zimbabwe',
  'WORLD',
];

const Selector = () => {
  const [state, dispatch] = useContext(userStateContext);
  const { userCountry, remittancesData } = state;
  const countryNames = remittancesData.map(({ name }) => name).filter(d => !NO_INCOMING_DATA.includes(d));
  const highlightCountryData = remittancesData.find(d => d.name === userCountry);
  const formattedTotalDollars = formatDollars(highlightCountryData.totalGdp);
  return (
    <section className="selector">
      <div className="selector__dropdown-holder">
        In 2017, the total remittances
        {' '}
        <CountryDropdown
          countries={countryNames}
          country={userCountry}
          setHighlighted={({ target }) => {
            const event = new CustomEvent('oTracking.event', {
              detail: Object.assign(
                {
                  category: 'ig-remittances',
                  action: 'country-dropdown',
                },
                { countryName: target.options[target.selectedIndex].text },
              ),
              bubbles: true,
            });
            document.body.dispatchEvent(event);
            dispatch({
              type: 'SET_COUNTRY_FILTER',
              target,
            });
          }}
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
