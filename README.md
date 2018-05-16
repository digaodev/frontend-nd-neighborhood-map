# Neighborhood Maps Project

* Write code required to add a full-screen map to your page using the Google Maps API. For sake of efficiency, the map API should be called only once.

* You will need to get a Google Maps API key, and include it as the value of the key parameter when loading the Google Maps API. You may have some initial concerns with placing your API key directly within your JavaScript source files, but rest assured this is perfectly safe. All client-side code must be downloaded by the client; therefore, the client must download this API key - it is not intended to be secret. Google has security measures in place to ensure your key is not abused. It is not technically possible to make anything secret on the client-side.

* Write code required to display map markers identifying at least 5 locations that you are interested in within this neighborhood. Your app should display those locations by default when the page is loaded.

* Implement a list view of the set of locations defined in step 5.

* Provide a filter option that uses an input field to filter both the list view and the map markers displayed by default on load. The list view and the markers should update accordingly in real time. Providing a search function through a third-party API is not enough to meet specifications. This filter can be a text input or a dropdown menu.

* Add functionality using third-party APIs to provide information when a map marker or list view entry is clicked (ex: Yelp reviews, Wikipedia, Flickr images, etc). Note that StreetView and Places don't count as an additional 3rd party API because they are libraries included in the Google Maps API. If you need a refresher on making AJAX requests to third-party servers, check out our Intro to AJAX course. Please provide attribution to the data sources/APIs you use. For example if you are using Foursquare, indicate somewhere in your interface and in your README that you used Foursquare's API.

* The app's interface should be intuitive to use. For example, the input text area to filter locations should be easy to locate. It should be easy to understand what set of locations is being filtered. Selecting a location via list item or map marker should cause the map marker to bounce or in some other way animate to indicate that the location has been selected and associated info window should open above the map marker with additional information.

* You can check the live completed project in [HERE](https://digaodev.github.io/frontend-nd-neighborhood-map/).

![Screen Shot for main](https://github.com/digaodev/frontend-nd-neighborhood-map/blob/docs/docs/Screen_main.png?raw=true)

![Screen Shot for main filter](https://github.com/digaodev/frontend-nd-neighborhood-map/blob/docs/docs/Screen_main_filter.png?raw=true)

![Screen Shot for main infowindow](https://github.com/digaodev/frontend-nd-neighborhood-map/blob/docs/docs/Screen_main_infowindow.png?raw=true)

![Screen Shot for mobile](https://github.com/digaodev/frontend-nd-neighborhood-map/blob/docs/docs/Screen_mobile.png?raw=true)

![Screen Shot for mobile filter](https://github.com/digaodev/frontend-nd-neighborhood-map/blob/docs/docs/Screen_mobile_filter.png?raw=true)

![Screen Shot for mobile infowindow](https://github.com/digaodev/frontend-nd-neighborhood-map/blob/docs/docs/Screen_mobile_infowindow.png?raw=true)

## How to run

To get started:

* install all project dependencies with `npm install`

  Notable dependencies:
```js
    "escape-string-regexp": "^1.0.5",

    "prop-types": "^15.6.1",

    "react-async-script-loader": "^0.3.0",
    
    "sort-by": "^1.2.0"
```

* create a file named `constants.js` in the root path and add your API credentials:

```js
  export const FSQUARE_CLIENT_ID = '<your-foursquare-client-id>';
  export const FSQUARE_CLIENT_SECRET = '<your-foursquare-secret-id>';
  export const GOOGLE_MAPS_KEY = '<your-google-maps-id>';
```

* start the development server with `npm start`

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
