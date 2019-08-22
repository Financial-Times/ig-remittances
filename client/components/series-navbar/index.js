import React from 'react';

const SeriesNavbar = ({ className, series: { name, url }, isSticky }) => (
  <div className={`${className}-container${isSticky ? ` ${className}-container--sticky` : ''}`}>
    <div className="o-grid-container o-grid-container--bleed">
      <div className="o-grid-row o-grid-row--compact">
        <div data-o-grid-colspan="12">
          <div className={className}>
            <div className={`${className}__inner`}>
              <div className={`${className}__title`}>
                <span>
FT Series
                </span>
                <a href={url}>
                  {name}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

SeriesNavbar.defaultProps = {
  className: 'series-navbar',
  isSticky: false,
};

export default SeriesNavbar;
