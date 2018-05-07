import React, { Component } from 'react';

import PropTypes from 'prop-types';

import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

import { FSQUARE_CLIENT_ID, FSQUARE_CLIENT_SECRET } from './constants';

import Location from './Location';

import defaultIcon from './icons/iconDefaultLocation.svg';
import activeIcon from './icons/iconActiveLocation.svg';
// https://github.com/SamHerbert/SVG-Loaders
import spinnerIcon from './images/puff.svg';

class Sidebar extends Component {
  state = {
    filterTerm: '',
    locations: [],
    locationsError: false
  };

  componentDidMount() {
    this.fetchCoworkingsFS()
      .then(coworkings => {
        this.setState({ locations: coworkings });
      })
      .catch(err => {
        this.setState({ locationsError: true });
      });
  }

  fetchCoworkingsFS = () => {
    const { lat, lng } = this.props.center;
    // https://developer.foursquare.com/docs/api/venues/search
    const fsURL = 'https://api.foursquare.com/v2/venues/search';
    // https://developer.foursquare.com/docs/resources/categories
    const categoryId = '4bf58dd8d48988d174941735'; // coworking spaces category
    const radius = 250;

    const fsEndpoint = `${fsURL}?ll=${lat},${lng}&client_id=${FSQUARE_CLIENT_ID}&client_secret=${FSQUARE_CLIENT_SECRET}&radius=${radius}&categoryId=${categoryId}&limit=30&v=20180504`;

    return fetch(fsEndpoint)
      .then(response => {
        if (!response.ok) throw response;

        return response.json();
      })
      .then(data => {
        const { venues } = data.response;

        // filter because of trash
        return venues
          .filter(
            venue =>
              venue.location.lat &&
              venue.location.lng &&
              venue.categories[0].id === categoryId
          )
          .slice(0, 20);
      });
  };

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
    //     To remove a marker from the map, call the setMap() method passing null as the argument.
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
        <header className="header">
          <span className="sidebar__icon office" />
          <h1 className="sidebar__title"> Coworkings @ Paulista </h1>
          <p className="sidebar__description">
            Find the top 20 coworking spaces near Paulista Avenue, São Paulo
          </p>

          {!locationsError ? (
            <input
              className="header__filter-input"
              name="filter"
              type="text"
              placeholder="Filter by name..."
              value={this.state.filterTerm}
              onChange={this.handleFilterInputChange}
            />
          ) : null}
        </header>

        {!locationsError ? (
          <ul>
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
            <h1>
              An error occurred while trying to load the coworkings list. Please
              try refreshing the page.
            </h1>
          </div>
        )}
      </aside>
    );
  }
}

export default Sidebar;
