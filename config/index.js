/**
 * @file
 * Main entry point for collecting configuration options, to be passed
 * to app as `context`.
 */

import axios from 'axios';
import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

export default async (environment = 'development') => {
  const d = await article(environment);
  const flags = await getFlags(environment);
  const { relatedContent } = await getOnwardJourney(environment);
  const mapboxToken = process.env.MAPBOX_TOKEN || '';
  const { data } = await axios.get(
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/bart-segments.json',
  );

  return {
    ...d,
    flags,
    relatedContent,
    mapboxToken,
    data,
  };
};
