import React, { Component } from 'react';

import PropTypes from 'prop-types';

class Location extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    onItemHover: PropTypes.func.isRequired,
    onItemBlur: PropTypes.func.isRequired,
    onOpenInfoWindow: PropTypes.func.isRequired
  };

  render() {
    const { location, onItemHover, onItemBlur, onOpenInfoWindow } = this.props;

    const ariaLabel = `View details on the map for ${location.name}`;

    return (
      <li
        className="location-card"
        onMouseEnter={() => onItemHover(location.marker)}
        onMouseLeave={() => onItemBlur(location.marker)}
        onClick={() => onOpenInfoWindow(location)}
      >
        <div className="location-card__label">
          <span>
            <h2> {location.marker.label.text} </h2>
          </span>
        </div>
        <button
          // button is needed here for keyboard accessibility
          className="location-card__content"
          tabIndex="0"
          aria-label={ariaLabel}
        >
          {location.name}
        </button>
      </li>
    );
  }
}

export default Location;
