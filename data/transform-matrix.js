/**
 * @file
 * Transforms the remittances matrix into a hierarchical structure
 */

const Papa = require('papaparse');
const { readFileSync, writeFileSync } = require('fs');

const csvString = readFileSync('./remittances_matrix.csv', 'utf-8');
const { data } = Papa.parse(csvString, { header: true });

const countries = new Map(
  data.filter(d => d.source === 'WORLD').map(({ target, source, ...d }) => [target, { ...d, children: [] }]),
);

data
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

writeFileSync(
  './remittances.json',
  JSON.stringify(
    [...countries]
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
  ),
);
