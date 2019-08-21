/**
 * @file
 * Data selector for radial dendrogram
 */

import React, { useContext } from 'react';
import { userStateContext } from '../../state';
import CountryDropdown from './country-dropdown';

// These are countries has no incoming remittance data
const NO_INCOMING_DATA = [
  'United Arab Emirates',
  'Libya',
  'Gabon',
  'Puerto Rico',
  'Singapore',
  'Equatorial Guinea',
  'Bahrain',
  'Chad',
  'Brunei',
  'Central African Republic',
  'Eritrea',
  'Somalia',
  'San Marino',
  'Andorra',
  'Guam',
  'Monaco',
  'Cayman Islands',
  'Channel Islands',
  'Northern Mariana Islands',
  'US Virgin Islands',
  'Cuba',
  'American Samoa',
  'Liechtenstein',
  'Sint Maarten (Dutch part)',
  'Isle of Man',
  'Greenland',
];

const Selector = () => {
  const [state, dispatch] = useContext(userStateContext);
  const { userCountry, remittancesData } = state;
  const countryNames = remittancesData.map(({ name }) => name).filter(d => !NO_INCOMING_DATA.includes(d));
  const highlightCountryData = remittancesData.find(d => d.name === userCountry);

  return (
    <section className="selector">
      <div className="selector__dropdown-holder">
        In 2018, the total of remittances
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
        <strong>
          $
          {highlightCountryData.children
            .find(d => d.name === 'Incoming remittances')
            .children.reduce((a, { net_mdollars }) => a + Number(net_mdollars), 0)
            .toLocaleString('en', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          m
        </strong>
      </div>
    </section>
  );
};

Selector.propTypes = {};

Selector.defaultProps = {};

export default Selector;
