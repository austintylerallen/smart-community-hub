import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.748817, // Default center (New York City)
  lng: -73.985428
};

const GoogleMapComponent = ({ destination }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const directionsCallback = useCallback((response) => {
    if (response !== null) {
      console.log('Directions response:', response); // Add console log
      if (response.status === 'OK') {
        setDirectionsResponse(response);
      } else {
        console.log('response: ', response);
      }
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {destination && (
          <DirectionsService
            options={{
              destination: destination,
              origin: 'Central Park, NY', // Set a default origin or use user location
              travelMode: 'DRIVING'
            }}
            callback={directionsCallback}
          />
        )}
        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
