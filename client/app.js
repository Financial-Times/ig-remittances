/**
 * @file
 * This is the root component for your project.
 */

import React, { useEffect, useReducer, Fragment } from 'react';
import Layout, {
  GridContainer, GridRow, GridChild, Byline, Share,
} from '@financial-times/g-components';
import { getCurrentLayout } from 'o-grid/main'; // eslint-disable-line import/no-unresolved
import { ContextPropType, ContextDefaultProps } from './util/prop-types';
import svgDimensions from './util/svg-dimensions';
import LineChart from './components/line-chart';
import Treemap from './components/treemap';
import Sticky from './components/sticky';
import ScrollStep from './components/scroll-step';
import FullBleedOffsetTopper from './components/full-bleed-offset-topper';
import SeriesNavbar from './components/series-navbar';
import useWindowDimensions from './hooks/use-window-dimensions';
import { userStateContext, initialState, reducers } from './state';
import lineChartData from '../data/remittances-line.csv';
import { OTHER_CATEGORY_LABEL } from './util/constants';

const App = (context) => {
  const {
    copy, scrollSteps, gdps, bilateralData, bylines, publishedDate,
  } = context;
  const [state, dispatch] = useReducer(reducers, initialState);
  const {
    blurred, remittancesData, showSelector, userCountry, articleCountry, treemapIsZoomed,
  } = state;

  // Custom hooks
  const { width: windowWidth } = useWindowDimensions();

  // Asynchronous effects should update state as per below
  useEffect(() => {
    (async () => {
      // @TODO replace with data for realsies
      // const { default: flareData } = await import('../data/flare.json');
      const segmented = bilateralData.map(({
        name, totalmdollarsold, totalgdppct, ...d
      }) => {
        const gdpData = gdps.find(e => name === e.country);
        return {
          name,
          totalmdollarsold,
          totalgdppct,
          code: gdpData ? gdpData.code : name,
          children: [
            {
              name: 'Incoming remittances',
              children: d.children
                .filter(g => +g.totalmdollarsold > 0)
                .map((e) => {
                  const gdp = gdps.find(f => e.name === f.country);
                  return {
                    ...e,
                    code: gdp ? gdp.code : e.name,
                  };
                }),
            },
            {
              name: OTHER_CATEGORY_LABEL,
              children: [],
              remainderGdp: Number(totalmdollarsold) / (Number(totalgdppct) / 100),
              // children: d.children
              //   .filter(g => +g.net_mdollars < 0)
              //   .map(({ net_mdollars, ...g }) => ({
              //     ...g,
              //     net_mdollars: Math.abs(net_mdollars),
              //   })),
            },
          ],
        };
      });

      dispatch({
        type: 'SET_REMITTANCES_DATA',
        data: segmented,
      });
    })();
  }, []);

  const matrixIndex = copy.indexOf('MATRIXMOBILE1');
  const treemapIndex = copy.indexOf('INTERACTIVETREEMAP');
  const section1Pars = copy.slice(0, matrixIndex);
  const section2Pars = copy.slice(matrixIndex, treemapIndex);
  const section3Pars = copy.slice(treemapIndex + 1);
  const mobileImages = [
    {
      s:
        'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Af46cce62-c8d7-11e9-a1f4-3669401ba76f?source=ig&width=600&format=png&quality=lossless',
      m:
        'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Af6b8b816-c8d7-11e9-a1f4-3669401ba76f?source=ig&width=1400&format=png&quality=lossless',
    },
    {
      s:
        'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2F000dcf90-c8ca-11e9-a1f4-3669401ba76f.img?source=ig',
      m:
        'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2Ffdf2326e-c8c9-11e9-a1f4-3669401ba76f.img?source=ig',
    },
    { s: 'https://via.placeholder.com/300x400.png', m: 'https://via.placeholder.com/700x500.png' },
  ];

  return (
    <userStateContext.Provider value={[state, dispatch]}>
      <Layout
        {...context}
        defaultContainer={false}
        wrapArticleHead={false}
        customArticleHead={(
          <Fragment>
            <SeriesNavbar series={{ name: 'Cash Trails', url: 'https://www.ft.com/cash-trails' }} isSticky />

            <FullBleedOffsetTopper {...context} />

            <GridContainer>
              <GridRow>
                <GridChild>
                  <Share {...context} />

                  <Byline names={bylines} date={publishedDate} />
                </GridChild>
              </GridRow>
            </GridContainer>
          </Fragment>
)}
      >
        <GridContainer>
          <GridRow>
            <GridChild>
              {section1Pars.map((p, i) => {
                if (p === 'LINECHART') {
                  return (
                    <LineChart
                      key={`graphic-1-${i + 1}`} // eslint-disable-line react/no-array-index-key
                      data={lineChartData}
                      layout={getCurrentLayout()}
                    />
                  );
                }

                return (
                  <p
                    key={`par-1-${i + 1}`} // eslint-disable-line react/no-array-index-key
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                );
              })}
            </GridChild>

            <div data-o-grid-colspan="hide L12 Lcenter">
              <figure className="graphic inline">
                <img
                  src="https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Af6b7d15e-c8d6-11e9-a1f4-3669401ba76f?source=ig&width=2360&format=png&quality=lossless"
                  alt=""
                />

                <figcaption className="o-typography-caption">
                  Graphic: TKTK
                  <br />
                  <em>
&#xA9;&nbsp;FT
                  </em>
                </figcaption>
              </figure>
            </div>

            {section2Pars.map((p, i) => {
              if (p.includes('MATRIXMOBILE')) {
                const imgIndex = parseInt(p[p.length - 1], 10) - 1;

                return (
                  <div
                    key={`graphic-2-${i + 1}`} // eslint-disable-line react/no-array-index-key
                    data-o-grid-colspan="12 S11 Scenter M9 Lhide"
                  >
                    <figure className="graphic inline">
                      {windowWidth <= 490 && <img alt="" src={mobileImages[imgIndex].s} />}
                      {windowWidth > 490 && <img alt="" src={mobileImages[imgIndex].m} />}

                      <figcaption className="o-typography-caption">
                        Graphic: TKTK
                        <br />
                        <em>
&#xA9;&nbsp;FT
                        </em>
                      </figcaption>
                    </figure>
                  </div>
                );
              }

              return (
                /* eslint-disable react/no-array-index-key */
                <GridChild key={`par-2-${i + 1}`}>
                  <p dangerouslySetInnerHTML={{ __html: p }} />
                </GridChild>
                /* eslint-enable react/no-array-index-key */
              );
            })}
          </GridRow>
        </GridContainer>

        <section>
          <Sticky blurred={blurred} svgDimensions={svgDimensions(windowWidth)}>
            {remittancesData && remittancesData.length ? (
              <Fragment>
                <Treemap
                  zoomed={treemapIsZoomed}
                  selected={showSelector ? userCountry : articleCountry}
                  showSelector={showSelector}
                  width={svgDimensions(windowWidth).width}
                  height={svgDimensions(windowWidth).height}
                  remittances={remittancesData}
                />
              </Fragment>
            ) : (
              <div className="loading">
                <p>
Loading data…
                </p>
              </div>
            )}
          </Sticky>

          {scrollSteps
            .map(({ content }, i) => (
              <ScrollStep
                key={`step-${i}`} // eslint-disable-line react/no-array-index-key
                stepIndex={i}
                content={content}
                onInView={(stepIndex) => {
                  switch (stepIndex) {
                    case 0:
                    default:
                      dispatch({ type: 'SET_TREEMAP_ZOOM', zoomed: false });
                      dispatch({ type: 'SET_ARTICLE_COUNTRY', articleCountry: 'Tonga' });
                      break;
                    case 1:
                      dispatch({ type: 'SET_ARTICLE_COUNTRY', articleCountry: 'Tonga' });
                      dispatch({ type: 'SET_TREEMAP_ZOOM', zoomed: true });
                      break;
                    case 2:
                      dispatch({ type: 'SET_TREEMAP_ZOOM', zoomed: false });
                      dispatch({ type: 'SET_ARTICLE_COUNTRY', articleCountry: 'Mexico' });
                      break;
                    case 3:
                      dispatch({ type: 'SET_TREEMAP_ZOOM', zoomed: true });
                      dispatch({ type: 'SET_ARTICLE_COUNTRY', articleCountry: 'Mexico' });
                      break;
                  }
                  // dispatch({ type: 'SET_ACTIVE_STEP', activeStep: stepIndex });
                }}
              />
            ))
            .concat([
              <ScrollStep
                key="step-instructions" // eslint-disable-line react/no-array-index-key
                stepIndex={5}
                content={`<div class="instructions">
                 <h1>Where do your country’s remittance flows come from?</h1>
                 <h2>Explore more than 190 countries’ remittances using the drop-down menu</h2>
                 <img alt="down arrow" style="width: 2em;" src="https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:arrow-down?source=test" />
                </div>`}
                onInView={() => {
                  dispatch({ type: 'SET_BLUR', blurred: true });
                  dispatch({ type: 'SET_SHOW_SELECTOR', showSelector: true });
                }}
                onOutView={() => {
                  dispatch({ type: 'SET_BLUR', blurred: false });
                }}
              />,
            ])}
        </section>

        <GridContainer>
          <GridRow>
            <GridChild>
              {section3Pars.map((p, i) => (
                <p
                  key={`par-3-${i + 1}`} // eslint-disable-line react/no-array-index-key
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </GridChild>
          </GridRow>
        </GridContainer>

        <GridContainer>
          <GridRow>
            <GridChild>
              <p>
                <em>
                  Additional design and development by Caroline Nevitt, Cale Tilford, Martin Stabe and Adrienne Klasa
                </em>
              </p>
            </GridChild>
          </GridRow>
        </GridContainer>
      </Layout>
    </userStateContext.Provider>
  );
};

App.propTypes = {
  ...ContextPropType,
};

App.defaultProps = {
  ...ContextDefaultProps,
};

export default App;
