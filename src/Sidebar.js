import React, { Component } from 'react';

import PropTypes from 'prop-types';

import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

class Sidebar extends Component {
  state = {
    filterTerm: '',
    locations: []
    // infoWindow: {}
  };

  // {
  //   id: 5,
  //   name: 'aaaaaaa',
  //   latitude: -23.566694,
  //   longitude: -46.6509694,
  // }
  addMarkersToMap = filteredLocations => {
    const { map } = this.props;
    // const { infoWindow } = this.state
    // Each marker is labeled with a single alphabetical character.
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let labelIndex = 0;

    filteredLocations.map(coworking => {

      coworking.marker = new window.google.maps.Marker({
        position: {
          lat: coworking.location.lat,
          lng: coworking.location.lng
        },
        map: map,
        title: coworking.name,
        label: {
          color: '#fff',
          text: labels[labelIndex++ % labels.length]
        },
        icon: defaultIcon
      });

      return coworking;
    });
  };

  clearMarkers = locations => {
    //     To remove a marker from the map, call the setMap() method passing null as the argument.
    // location.marker.setMap(null);
    locations.map(location => location.marker.setMap(null));
  };

  render() {
    const { locations, filterTerm } = this.state;

    let filteredLocations;

    if (locations) {
      if (filterTerm) {
        this.clearMarkers(locations);
        const match = new RegExp(escapeRegExp(filterTerm), 'i');
        filteredLocations = locations.filter(location =>
          match.test(location.name)
        );
      } else {
        filteredLocations = locations;
      }

      filteredLocations.sort(sortBy('name'));

      this.addMarkersToMap(filteredLocations);
    }

    return (
      <aside className="sidebar">
        <header className="header">
          <span className="sidebar__icon office" />
          <h1 className="sidebar__title"> Coworkings @ Paulista </h1>
          <p className="sidebar__description">
            Find the top 20 coworking spaces near Paulista Avenue, São Paulo
          </p>
          <input
            className="header__filter-input"
            name="filter"
            type="text"
            placeholder="Filter by name..."
            value={this.state.filterTerm}
            onChange={this.handleFilterInputChange}
          />
        </header>
        <ul>
          {filteredLocations.map(location => (
            <li
              className="location-card"
              key={location.id}
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
          ))}
        </ul>
      </aside>
    );
  }
}

export default Sidebar;
