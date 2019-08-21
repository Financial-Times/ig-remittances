/**
 * @file
 * Data selector for radial dendrogram
 */

import React, { useContext } from 'react';
import { userStateContext } from '../../state';
import CountryDropdown from './country-dropdown';

const Selector = () => {
  const [state, dispatch] = useContext(userStateContext);
  const { highlightCountry, remittancesData } = state;
  const countryNames = remittancesData.map(({ name }) => name);
  const highlightCountryData = remittancesData.find(d => d.name === highlightCountry);

  return (
    <section className="selector">
      <div className="selector__dropdown-holder">
        In 2018, the total of remittances
        {' '}
        <CountryDropdown
          countries={countryNames}
          country={highlightCountry}
          setHighlighted={({ target }) => dispatch({
            type: 'SET_COUNTRY_FILTER',
            target,
          })
          }
        />
        received from other countries was
        {' '}
        <strong>
          $
          {highlightCountryData.children
            .find(d => d.name === 'Incoming remittances')
            .children.reduce((a, { net_mdollars }) => a + Number(net_mdollars) * 1000000, 0)
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
