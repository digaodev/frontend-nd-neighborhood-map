import React, { Component } from 'react';

import asyncScriptLoader from 'react-async-script-loader';

import './App.css';

import Sidebar from './Sidebar';
import { mapStyles } from './mapStyles';

import ImagePlaceholder from './images/ImagePlaceholder.png';
// https://github.com/SamHerbert/SVG-Loaders
import spinnerIcon from './images/puff.svg';

import {
  GOOGLE_MAPS_KEY,
  FSQUARE_CLIENT_ID,
  FSQUARE_CLIENT_SECRET
} from './constants';

class App extends Component {
  state = {
    map: {},
    infoWindow: { maxWidth: 300 },
    isMapReady: false,
    center: { lat: -23.5660791, lng: -46.652984 }, //Av paulista
    mapError: false
  };

  componentDidUpdate() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    const { center, isMapReady, mapError } = this.state;

    // console.log('===================');
    // console.log('isScriptLoaded', isScriptLoaded);
    // console.log('isScriptLoadSucceed', isScriptLoadSucceed);
    // console.log('isMapReady', isMapReady);
    // console.log('mapError', mapError);

    if (isScriptLoaded && isScriptLoadSucceed && !isMapReady) {
      // console.log('1');
      // if (!isMapReady) {
      // create a new map with different styles
      let map = new window.google.maps.Map(document.querySelector('#map'), {
        zoom: 17,
        center: new window.google.maps.LatLng(center),
        styles: mapStyles
      });

      // get a reference for the reusable infowindow
      const infoWindow = new window.google.maps.InfoWindow({});

      // set all the state for the map
      this.setState({
        map: map,
        infoWindow: infoWindow,
        isMapReady: true
      });
      // }
    } else if (!mapError && !isMapReady) {
      // console.log('2');
      this.setState({
        mapError: true
      });
    }
  }

  handleItemClick = coworking => {
    const { map, infoWindow } = this.state;

    this.fetchCoworkingDetailFS(coworking)
      .then(response => {
        const {
          name,
          verified,
          location,
          canonicalUrl,
          shortUrl,
          url,
          likes,
          bestPhoto,
          contact,
          tips
        } = response;

        // console.log(response);

        const venue = {
          name: name,
          verified: verified ? 'VERIFIED' : 'NOT VERIFIED',
          address: location.address || 'No address available',
          canonicalUrl: canonicalUrl || shortUrl || 'https://foursquare.com/',
          url: url,
          likes: likes.count,
          photo: bestPhoto
            ? `${bestPhoto.prefix}width100${bestPhoto.suffix}`
            : ImagePlaceholder,
          twitter:
            contact && contact.twitter
              ? contact.twitter
              : 'No twitter available',
          phone:
            contact && contact.formattedPhone
              ? contact.formattedPhone
              : 'No phone available',
          tips:
            tips.count > 0
              ? `"${tips.groups[0].items[0].text}"`
              : 'No tips available'
        };

        const siteVenue = venue.url
          ? `<a href="${venue.url}" target="_blank">${venue.url}
              </a>`
          : 'No site available';

        const contentString = `
          <div class="infow__container">
          <header class="infow__header">
            <h2 class="infow__header__maintitle">${venue.name}</h2>
            <span class="infow__header__badge">${venue.verified}</span>
            <span class="infow__header__badge">${venue.likes} LIKES</span>
          </header>

          <main class="infow__main">
          <div class="infow__main__img">
            <img src=${venue.photo} alt=${venue.name}/>
          </div>

            <section class="infow__main__content">
              <h3 class="infow__main__subtitle">Address</h3>
              <p>${venue.address}</p>

              <h3 class="infow__main__subtitle">Contacts</h3>
              <p>Twitter: ${venue.twitter}</p>
              <p>Phone: ${venue.phone}</p>

              <h3 class="infow__main__subtitle">Site</h3>
              <p>${siteVenue}</p>

              <h3 class="infow__main__subtitle">Tips</h3>
              <p>${venue.tips}</p>

              <p class="infow__main__more">
                <a  href="${venue.canonicalUrl}" target="_blank">
                  <span>See more on Foursquare</span>
                </a>
              </p>
            </section>
          </main>
        </div>
     `;

        infoWindow.setContent(contentString);
        infoWindow.open(map, coworking.marker);
      })
      .catch(err => {
        const contentString = `
          <div class="infow__container">
          <header class="infow__header">
            <h2 class="infow__header__maintitle">Error loading coworking details from Foursquare</h2>
          </header>

          <main class="infow__main">
            <section class="infow__main__content">
              <h3 class="infow__main__subtitle">Description</h3>
              <p>An error occurred while trying to access detailed information for the coworking "${
                coworking.name
              }". Please try again later.</p>
            </section>
          </main>
        </div>
     `;
        // console.log('err', err);
        infoWindow.setContent(contentString);
        infoWindow.open(map, coworking.marker);
      });
  };

  fetchCoworkingDetailFS = location => {
    // https://developer.foursquare.com/docs/api/venues/details
    const fsURL = 'https://api.foursquare.com/v2/venues';

    const fsEndpoint = `${fsURL}/${
      location.id
    }?client_id=${FSQUARE_CLIENT_ID}&client_secret=${FSQUARE_CLIENT_SECRET}&v=20180504`;

    return fetch(fsEndpoint)
      .then(response => {
        // console.log(response);
        if (!response.ok) throw response;

        return response.json();
      })
      .then(data => data.response.venue);
  };

  render() {
    const { map, infoWindow, isMapReady, center, mapError } = this.state;

    return (
      <div className="App">
        <main className="main" role="main">
          {isMapReady ? (
            <Sidebar
              map={map}
              infoWindow={infoWindow}
              center={center}
              onOpenInfoWindow={this.handleItemClick}
            />
          ) : null}

          <div id="map" className="map" role="application">
            {mapError ? (
              <div className="map-error-message">
                <h1>
                  The map was unable to load. Please try refreshing the page.
                </h1>
              </div>
            ) : (
              <div className="map-loading-message">
                <h1>Loading...</h1>
                <img src={spinnerIcon} className="spinner" alt="" />
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default asyncScriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`
])(App);
