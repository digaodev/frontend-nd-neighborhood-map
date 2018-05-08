import { FSQUARE_CLIENT_ID, FSQUARE_CLIENT_SECRET } from './constants';

export const fetchCoworkingDetailFS = location => {
  // https://developer.foursquare.com/docs/api/venues/details
  const fsURL = 'https://api.foursquare.com/v2/venues';

  const fsEndpoint = `${fsURL}/${
    location.id
  }?client_id=${FSQUARE_CLIENT_ID}&client_secret=${FSQUARE_CLIENT_SECRET}&v=20180504`;

  return fetch(fsEndpoint)
    .then(response => {
      if (!response.ok) throw response;

      return response.json();
    })
    .then(data => data.response.venue);
};

export const fetchCoworkingsFS = ({ lat, lng }) => {
  // https://developer.foursquare.com/docs/api/venues/search
  const fsURL = 'https://api.foursquare.com/v2/venues/search';

  // https://developer.foursquare.com/docs/resources/categories
  const categoryId = '4bf58dd8d48988d174941735'; // category for coworking spaces

  const radius = 250;

  const fsEndpoint = `${fsURL}?ll=${lat},${lng}&client_id=${FSQUARE_CLIENT_ID}&client_secret=${FSQUARE_CLIENT_SECRET}&radius=${radius}&categoryId=${categoryId}&limit=30&v=20180504`;

  return fetch(fsEndpoint)
    .then(response => {
      if (!response.ok) throw response;

      return response.json();
    })
    .then(data => {
      const { venues } = data.response;

      // Even though theFoursquare API supports search by category, it still returns a lot of items from other categories. So the filter below is necessary
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
