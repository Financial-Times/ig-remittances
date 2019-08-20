/**
 * @file
 * Main entry point for collecting configuration options, to be passed
 * to app as `context`.
 */

import axios from 'axios';
import StructuredGoogleDocsClient from 'structured-google-docs-client';
import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

const BILATERAL_BERTHA = 'http://bertha.ig.ft.com/view/publish/gss/1CDRVnjEDTV7eXnYxM0FoabpC9O6LlyyMci1lzLmWX2w/total,bilateral';
const COPY_BERTHA = '12TyuigeVMv5ut8YW-qVsQdtkLKraH0t43BqBFLfu4Rk';
async function loadCopy(id) {
  const content = await StructuredGoogleDocsClient(id);
  const contentClean = content
    .replace('<html><head></head><body>', '') // remove top guff
    .replace('</body></html>', '') // remove bottom guff
    .replace('<p></p>', '') // remove empty paragraphs
    .replace(/<\/?u>/g, '') // links seem to come with <u> tags too
    .replace(/<p>/g, '')
    .split(/<\/p>/g);
  const cruft = contentClean.pop(); // eslint-disable-line no-unused-vars

  return contentClean;
}

export default async (environment = 'development') => {
  const articleData = await article(environment);
  const flags = await getFlags(environment);
  const { relatedContent } = await getOnwardJourney(environment);
  const {
    data: { bilateral: bilateralData, total: gdps },
  } = await axios(BILATERAL_BERTHA);
  const countries = new Map(
    bilateralData.filter(d => d.source === 'WORLD').map(({ target, source, ...d }) => [target, { ...d, children: [] }]),
  );
  const copy = await loadCopy(COPY_BERTHA);

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
    copy,
  };
};
