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
        <div className="location-card__content">
          <h3> {location.name} </h3>
        </div>
      </li>
    );
  }
}

export default Location;
