import React, { Component } from 'react';

import PropTypes from 'prop-types';

import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

import Location from './Location';

import defaultIcon from '../icons/iconDefaultLocation.svg';
import activeIcon from '../icons/iconActiveLocation.svg';

import { fetchCoworkingsFS } from '../utils/foursquare';

class Sidebar extends Component {
  static propTypes = {
    center: PropTypes.object.isRequired,
    infoWindow: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    onOpenInfoWindow: PropTypes.func.isRequired
  };

  state = {
    filterTerm: '',
    locations: [],
    locationsError: false
  };

  componentDidMount() {
    fetchCoworkingsFS(this.props.center)
      .then(coworkings => {
        this.setState({ locations: coworkings });
      })
      .catch(err => {
        this.setState({ locationsError: true });
      });
  }

  handleFilterInputChange = event => {
    this.setState({
      filterTerm: event.target.value.trim()
    });
  };

  addMarkersToMap = filteredLocations => {
    const { map, onOpenInfoWindow } = this.props;

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

      coworking.marker.addListener('click', function() {
        onOpenInfoWindow(coworking);
      });

      return coworking;
    });
  };

  clearMarkers = locations => {
    // https://developers.google.com/maps/documentation/javascript/markers
    // To remove a marker from the map, call the setMap() method passing null as the argument.
    locations.map(location => location.marker.setMap(null));
  };

  handleItemHover = marker => {
    marker.setIcon(activeIcon);
  };
  handleItemBlur = marker => {
    marker.setIcon(defaultIcon);
  };

  render() {
    const { onOpenInfoWindow } = this.props;
    const { locations, filterTerm, locationsError } = this.state;

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
        <header className="sidebar__header">
          <p>Info provided by Google & Foursquare</p>
          <span className="sidebar__header__icon office" />
          <h1 className="sidebar__header__title" tabIndex="0"> Co-workings @ Paulista </h1>
          <p className="sidebar__header__description" tabIndex="0">
            Find the top 20 co-working spaces near Paulista Avenue, São Paulo
          </p>

          {!locationsError ? (
            <input
              className="sidebar__header__filter-input"
              name="filter"
              type="text"
              placeholder="Filter by name..."
              value={this.state.filterTerm}
              onChange={this.handleFilterInputChange}
              role="search"
              aria-label="Filter co-working list by name"
            />
          ) : null}
        </header>

        {!locationsError ? (
          <ul className="sidebar__locations-list" tabIndex="0" aria-label="List of co-workings">
            {filteredLocations.map(location => (
              <Location
                key={location.id}
                location={location}
                onItemHover={this.handleItemHover}
                onItemBlur={this.handleItemBlur}
                onOpenInfoWindow={onOpenInfoWindow}
              />
            ))}
          </ul>
        ) : (
          <div className="list-error-message">
            <p>
              An error occurred while trying to load the co-workings list. Please
              try refreshing the page.
            </p>
          </div>
        )}
      </aside>
    );
  }
}

export default Sidebar;
