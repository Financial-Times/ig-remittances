import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { GridContainer, GridRow, GridChild } from '@financial-times/g-components';
import { useInView } from 'react-intersection-observer';

const ScrollStep = ({ stepIndex, content, onInView }) => {
  const [cardRef, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) {
      onInView(stepIndex);
    }
  }, [inView]);

  return (
    <div className="scroll-step">
      <GridContainer>
        <GridRow>
          <GridChild>
            <div ref={cardRef} className="card">
              <h2>
                {content}
              </h2>
            </div>
          </GridChild>
        </GridRow>
      </GridContainer>
    </div>
  );
};

ScrollStep.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  content: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  onInView: PropTypes.func.isRequired,
};

export default ScrollStep;
