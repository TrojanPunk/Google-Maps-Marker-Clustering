import React, { useState, useEffect } from 'react';   // Install the following:
import GoogleMapReact from 'google-map-react';        // npm i google-map-react
import Marker from 'google-map-react';                
import Popup from 'google-map-react';
import { Loader } from '@googlemaps/js-api-loader';   // npm i @googlemaps/js-api-loader
import ReactDOM from 'react-dom';

function MyMap() {
  const [addresses, setAddresses] = useState([]);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default center of San Francisco

  // Performs side effects in the components
  useEffect(() => {
    const loader = new Loader({
      apiKey: 'ENTER API KEY'
    });

    // Loading the component using the API key as reference
    loader.load().then(() => {
      setIsLoading(false);
      setMap(
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'ENTER API KEY' }}
          center={center}
          zoom={13}
          style={{ height: '100vh' }}
        >

          // Responsible for allotting the latitude and longitude of a location
          {addresses.map((address, index) => (
            <Marker
              key={index}
              lat={address.position.lat}
              lng={address.position.lng}
            >
              <Popup>{address.name}</Popup>
            </Marker>
          ))}
        </GoogleMapReact>
      );
    });
  }, []);

  // Handling async function
  const handleGeocode = async () => {
    const geocoder = new window.google.maps.Geocoder();

    const promises = addresses.map(async (address) => {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address.name }, (results, status) => {
          if (status === 'OK') {
            resolve({
              name: address.name,
              position: {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
              },
            });
          } else {
            reject(status);
          }
        });
      });
    });

    Promise.all(promises).then((data) => {
      setAddresses(data);
    });
  };

  const handleChange = (event, index) => {
    const newAddresses = [...addresses];
    newAddresses[index].name = event.target.value;
    setAddresses(newAddresses);
  };

  const handleAddAddress = () => {
    const newAddresses = [...addresses, { name: '' }];
    setAddresses(newAddresses);
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  // returning the event
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            {addresses.map((address, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Address"
                  value={address.name}
                  onChange={(event) => handleChange(event, index)}
                />
                <button onClick={() => handleRemoveAddress(index)}>Remove</button>
              </div>
            ))}
            <button onClick={handleAddAddress}>Add Address</button>
            <button onClick={handleGeocode}>Geocode</button>
          </div>
          {map}
        </>
      )}
    </div>
  );
};

// Fetching the DOM root using id
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(MyMap);

export default MyMap;




