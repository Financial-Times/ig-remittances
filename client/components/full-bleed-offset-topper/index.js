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
          srcSet="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/481cfb72-c8f1-11e9-a1f4-3669401ba76f?source=ig&amp;fit=scale-down&amp;quality=highest&amp;width=490 490w" // eslint-disable-line max-len
        />
        <source
          media="(max-width: 1220px)"
          srcSet="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/16596fc8-c8ef-11e9-a1f4-3669401ba76f?source=ig&amp;fit=scale-down&amp;quality=highest&amp;width=1220 1220w" // eslint-disable-line max-len
        />
        <source
          media="(min-width: 1220px)"
          srcSet="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/9b174150-c8ee-11e9-a1f4-3669401ba76f?source=ig&amp;fit=scale-down&amp;quality=highest&amp;width=1440 1440w" // eslint-disable-line max-len
        />
        <img
          alt=""
          className="o-topper__image"
          src="https://www.ft.com/__origami/service/image/v2/images/raw/http://prod-upp-image-read.ft.com/16596fc8-c8ef-11e9-a1f4-3669401ba76f?source=ig&amp;fit=scale-down&amp;quality=highest&amp;width=1440" // eslint-disable-line max-len
        />
      </picture>
      <figcaption className="o-topper__image-credit">
&#xA9; FT
      </figcaption>
    </figure>
  </div>
);

export default FullBleedOffsetTopper;
