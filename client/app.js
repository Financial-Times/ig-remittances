/**
 * @file
 * This is the root component for your project.
 */

import React, { useEffect, useReducer, Fragment } from 'react';
import Layout, { GridContainer, GridRow, GridChild } from '@financial-times/g-components';
import { ContextPropType, ContextDefaultProps } from './util/prop-types';
import svgDimensions from './util/svg-dimensions';
import LineChart from './components/line-chart';
import Treemap from './components/treemap';
import Selector from './components/selector';
import Sticky from './components/sticky';
import ScrollStep from './components/scroll-step';
import useWindowDimensions from './hooks/use-window-dimensions';
import { userStateContext, initialState, reducers } from './state';
import lineChartData from '../data/remittances-line.csv';
import { OTHER_CATEGORY_LABEL } from './util/constants';

const DEBUG = 'Tonga';

const App = (context) => {
  const { copy } = context;
  const [state, dispatch] = useReducer(reducers, initialState);
  const {
    remittancesData, highlightCountry, treemapIsZoomed, activeStep,
  } = state;

  // Custom hooks
  const { width: windowWidth } = useWindowDimensions();

  // Asynchronous effects should update state as per below
  useEffect(() => {
    (async () => {
      const { default: remittances } = await import('../data/remittances.json');
      // @TODO replace with data for realsies
      // const { default: flareData } = await import('../data/flare.json');
      const segmented = remittances.map(d => ({
        name: d.name,
        children: [
          {
            name: 'Incoming remittances',
            children: d.children.filter(g => +g.net_mdollars > 0),
          },
          {
            name: OTHER_CATEGORY_LABEL,
            children: [],
            remainderGdp: Number(d.total_mdollars) / Number(d.total_gdppct),
            // children: d.children
            //   .filter(g => +g.net_mdollars < 0)
            //   .map(({ net_mdollars, ...g }) => ({
            //     ...g,
            //     net_mdollars: Math.abs(net_mdollars),
            //   })),
          },
        ],
      }));

      dispatch({
        type: 'SET_REMITTANCES_DATA',
        data: segmented,
      });
    })();
  }, []);

  const treemapSteps = ['Zero', 'One', 'Two', 'Three'];
  const matrixIndex = copy.indexOf('MATRIXMOBILE1');
  const treemapIndex = copy.indexOf('INTERACTIVETREEMAP');
  const section1Pars = copy.slice(0, matrixIndex);
  const section2Pars = copy.slice(matrixIndex, treemapIndex);
  const section3Pars = copy.slice(treemapIndex + 1);
  const mobileImages = [
    { s: 'https://via.placeholder.com/300x400.png', m: 'https://via.placeholder.com/700x500.png' },
    { s: 'https://via.placeholder.com/300x400.png', m: 'https://via.placeholder.com/700x500.png' },
    { s: 'https://via.placeholder.com/300x400.png', m: 'https://via.placeholder.com/700x500.png' },
  ];

  return (
    <userStateContext.Provider value={[state, dispatch]}>
      <Layout {...context} defaultContainer={false}>
        <GridContainer>
          <GridRow>
            <GridChild>
              {section1Pars.map((p, i) => {
                if (p === 'LINECHART') {
                  return (
                    <LineChart
                      key={`graphic-1-${i + 1}`} // eslint-disable-line react/no-array-index-key
                      data={lineChartData}
                      isMobile={windowWidth < 980}
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
                <img src="https://via.placeholder.com/1180x1180.png" alt="" />

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
          <Sticky activeStep={activeStep} svgDimensions={svgDimensions(windowWidth)}>
            {remittancesData && remittancesData.length ? (
              <Fragment>
                {/* <Selector /> */}
                <Treemap
                  zoomed={activeStep > 1}
                  selected={DEBUG}
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

          {treemapSteps.map((step, i) => (
            <ScrollStep
              key={`step-${i}`} // eslint-disable-line react/no-array-index-key
              stepIndex={i}
              content={step}
              onInView={stepIndex => dispatch({ type: 'SET_ACTIVE_STEP', activeStep: stepIndex })}
            />
          ))}
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
