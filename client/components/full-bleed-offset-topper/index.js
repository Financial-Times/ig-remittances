import React from 'react';

const FullBleedOffsetTopper = ({ headline, summary, topic }) => (
  <div className="o-topper o-topper--full-bleed-offset o-topper--color-slate">
    <div className="o-topper__content">
      <div className="o-topper__tags">
        <a href={topic.url} className="o-topper__topic">
          {topic.name}
        </a>
      </div>
      <h1 className="o-topper__headline o-topper__headline--large">
        <span className="article-classifier__gap">
          {headline}
        </span>
      </h1>
      <div className="o-topper__standfirst">
        {summary}
      </div>
    </div>

    <div className="o-topper__background" />

    <figure className="o-topper__visual">
      <picture className="o-topper__picture">
        <source
          media="(max-width: 490px)"
          srcSet="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/42da357a-f78e-11e7-8715-e94187b3017e?source=next&amp;fit=scale-down&amp;quality=highest&amp;width=490 490w" // eslint-disable-line max-len
        />
        <source
          media="(max-width: 1220px)"
          srcSet="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/05fff02c-f78e-11e7-8715-e94187b3017e?source=next&amp;fit=scale-down&amp;quality=highest&amp;width=1220 1220w" // eslint-disable-line max-len
        />
        <source
          media="(min-width: 1220px)"
          srcSet="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/402afdfa-f78e-11e7-8715-e94187b3017e?source=next&amp;fit=scale-down&amp;quality=highest&amp;width=1440 1440w" // eslint-disable-line max-len
        />
        <img
          alt=""
          className="o-topper__image"
          src="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/05fff02c-f78e-11e7-8715-e94187b3017e?source=next&amp;fit=scale-down&amp;quality=highest&amp;width=1440" // eslint-disable-line max-len
        />
      </picture>
      <figcaption className="o-topper__image-credit">
&#xA9; FT
      </figcaption>
    </figure>
  </div>
);

export default FullBleedOffsetTopper;
