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
    case 'SET_BLUR':
      return {
        ...state,
        blurred: action.blurred,
      };
    case 'SET_COUNTRY_FILTER':
      return {
        ...state,
        userCountry: action.target.value,
      };
    case 'SET_ARTICLE_COUNTRY':
      return {
        ...state,
        showSelector: false,
        articleCountry: action.articleCountry,
      };
    case 'TOGGLE_TREEMAP_ZOOM':
      return {
        ...state,
        treemapIsZoomed: !state.treemapIsZoomed,
      };
    case 'SET_TREEMAP_ZOOM':
      return {
        ...state,
        treemapIsZoomed: action.zoomed,
      };
    case 'SET_ACTIVE_STEP':
      return {
        ...state,
        activeStep: action.activeStep,
      };
    case 'SET_SHOW_SELECTOR':
      return {
        ...state,
        treemapIsZoomed: true,
        showSelector: action.showSelector,
      };
    default:
      return { ...state };
  }
};
export const initialState = {
  userCountry: 'Mexico',
  articleCountry: 'Tonga',
  direction: 'sent',
  remittancesData: [],
  blurred: false,
  treemapIsZoomed: false,
  activeStep: 0,
  showSelector: false,
};
