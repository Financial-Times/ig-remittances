import React from 'react';
import {
  GridContainer, GridRow, GridChild, ArticleHead,
} from '@financial-times/g-components';
import { ContextPropType, ContextDefaultProps } from '../../util/prop-types';

const FullBleedTopper = (props) => {
  const {
    headline, summary, publishedDate, topic, bylines,
  } = props;

  return (
    <div className="full-bleed-topper__container">
      <GridContainer>
        <GridRow>
          <GridChild>
            <ArticleHead
              headline={headline}
              summary={summary}
              mainImage=""
              publishedDate={publishedDate}
              topic={topic}
              bylines={bylines}
            />
          </GridChild>
        </GridRow>
      </GridContainer>
    </div>
  );
};

FullBleedTopper.propTypes = {
  ...ContextPropType,
};

FullBleedTopper.defaultProps = {
  ...ContextDefaultProps,
};

export default FullBleedTopper;
