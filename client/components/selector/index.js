/**
 * @file
 * Data selector for radial dendrogram
 */

import React, { useContext } from 'react';
import { userStateContext } from '../../state';
import CountryDropdown from './country-dropdown';
import DirectionDropdown from './direction-dropdown';
import Preset from './preset';

const Selector = () => {
  const [state, dispatch] = useContext(userStateContext);
  const { highlightCountry, remittancesData, direction } = state;
  const flatCountries = remittancesData.children.flatMap(({ children }) => children);
  const hightlightCountryData = flatCountries.find(d => d.country_iso3 === highlightCountry);

  return (
    <section className="selector">
      <div className="selector__dropdown-holder">
        In 2018, the total of remittances
        {' '}
        <CountryDropdown
          countries={flatCountries}
          country={highlightCountry}
          setHighlighted={({ target }) => dispatch({
            type: 'SET_COUNTRY_FILTER',
            target,
          })
          }
        />
        {' '}
        <DirectionDropdown
          direction={direction}
          setDirection={({ target }) => dispatch({
            type: 'SET_FILTER_DIRECTION',
            target,
          })
          }
        />
        {' '}
        other countries was
        {' '}
        <strong>
          $
          {hightlightCountryData.value.toLocaleString('en', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          m
        </strong>
      </div>
      <div className="selector__preset-holder">
        See example:
        {' '}
        <Preset country="Ukraine" country_iso3="UKR" direction="sent" dispatch={dispatch} />
        {', '}
        <Preset country="Greece" country_iso3="GRC" direction="received" dispatch={dispatch} />
      </div>
    </section>
  );
};

Selector.propTypes = {};

Selector.defaultProps = {};

export default Selector;
