import React, { Component } from 'react';

import asyncScriptLoader from 'react-async-script-loader';

import './App.css';

import {
  GOOGLE_MAPS_KEY,
} from './constants';

class App extends Component {
  state = {
    map: {},
    isMapReady: false,
    center: { lat: -23.5660791, lng: -46.652984 }, //Av paulista
    // error: false,
    locations: [
      {
        id: 1,
        name: 'Coworking 1',
        latitude: -23.5574374,
        longitude: -46.6603571,
      },
      {
        id: 2,
        name: 'Coworking 2',
        latitude: -23.5588241,
        longitude: -46.6598958,
      },
      {
        id: 3,
        name: 'Coworking 3',
        latitude: -23.5608967,
        longitude: -46.6562399,
      },
      {
        id: 4,
        name: 'Coworking 4',
        latitude: -23.5630824,
        longitude: -46.653598,
      },
      {
        id: 5,
        name: 'Coworking 5',
        latitude: -23.566694,
        longitude: -46.6509694,
      },
      {
        id: 6,
        name: 'Coworking 6',
        latitude: -23.56089,
        longitude: -46.65623,
      }
    ]
  };

  componentDidUpdate() {
    if (!this.state.isMapReady) {

      let map = new window.google.maps.Map(document.querySelector('#map'), {
        zoom: 17,
        center: new window.google.maps.LatLng(this.state.center)
      });

      // set all the state for the map
      this.setState({
        map: map,
        isMapReady: true
      });
    }
  }

  render() {
    const {
      map,
      isMapReady,
      center,
    } = this.state;

    return (
      <div className="App">
        <main className="main" role="main">
          <div id="map" className="map" role="application" />
        </main>
      </div>
    );
  }
}

export default asyncScriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`
])(App);
