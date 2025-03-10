'use client';

import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 13.8443, // Latitude for San Juan, Batangas
  lng: 121.4079 // Longitude for San Juan, Batangas
};

const Map: React.FC = () => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Map of San Juan, Batangas</h2>
      <LoadScript googleMapsApiKey="AIzaSyCmphihakge8jdjdfyrD5vBq1gLNopuj4c">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {/* Add markers or other components here if needed */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map; 