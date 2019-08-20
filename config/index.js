/**
 * @file
 * Main entry point for collecting configuration options, to be passed
 * to app as `context`.
 */

import axios from 'axios';
import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

/* eslint-disable max-len */
const BILATERAL_BERTHA = 'http://bertha.ig.ft.com/view/publish/gss/1CDRVnjEDTV7eXnYxM0FoabpC9O6LlyyMci1lzLmWX2w/total,bilateral';
const SLIDES_BERTHA = 'http://bertha.ig.ft.com/view/publish/gss/1Km6vyUJPWGyr9uI7osQikXESyKHeuxheMS04EbOgXbE/data';
/* eslint-enable max-len */

export default async (environment = 'development') => {
  const articleData = await article(environment);
  const flags = await getFlags(environment);
  const { relatedContent } = await getOnwardJourney(environment);
  const {
    data: { bilateral: bilateralData, total: gdps },
  } = await axios(BILATERAL_BERTHA);
  const { data: scrollSteps } = await axios(SLIDES_BERTHA);
  const countries = new Map(
    bilateralData.filter(d => d.source === 'WORLD').map(({ target, source, ...d }) => [target, { ...d, children: [] }]),
  );

  bilateralData
    .filter(({ source }) => source !== 'WORLD')
    .forEach(({ target, source, ...d }) => {
      const current = countries.get(target) || countries.set(target, { children: [] }).get(target);
      if (current.children) {
        current.children.push({
          name: source,
          ...d,
        });
      } else {
        console.log(target);
      }
    });

  return {
    ...articleData,
    flags,
    relatedContent,
    gdps,
    scrollSteps,
    bilateralData: [...countries]
      .map(([k, v]) => {
        if (k) {
          return {
            name: k,
            ...v,
          };
        }
        return null;
      })
      .filter(d => d),
  };
};
