import React, { Component } from 'react';

class Location extends Component {
  render() {
    const { location, onItemHover, onItemBlur, onOpenInfoWindow } = this.props;

    // console.log(onItemHover);
    // console.log(onOpenInfoWindow);

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
