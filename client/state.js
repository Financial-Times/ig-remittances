/**
 * @file
 * Redux-esque lite global state management
 */
import { createContext } from 'react';

export const userStateContext = createContext();
export const reducers = (state, { type, ...action }) => {
  switch (type) {
    case 'SET_REMITTANCES_DATA':
      return {
        ...state,
        remittancesData: action.data,
      };
    case 'SET_PRESET':
      return {
        ...state,
        highlightCountry: action.country,
        direction: action.direction,
      };
    case 'SET_BLUR':
      return {
        ...state,
        blurred: action.blurred,
      };
    case 'SET_COUNTRY_FILTER':
      return {
        ...state,
        highlightCountry: action.target.value,
      };
    case 'SET_FILTER_DIRECTION':
      return {
        ...state,
        direction: action.target.value,
      };
    default:
      return { ...state };
  }
};
export const initialState = {
  highlightCountry: 'UKR',
  direction: 'sent',
  remittancesData: [],
  blurred: false,
};
