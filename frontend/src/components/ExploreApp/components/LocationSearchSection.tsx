import React from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { mapContainerStyle } from '../constants';

interface LocationSearchSectionProps {
  isMobile: boolean;
  center: google.maps.LatLngLiteral;
  markerPosition: google.maps.LatLngLiteral;
  onMapLoad: (map: google.maps.Map) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleEnterKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePlaceChanged: () => void;
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
}

const LocationSearchSection: React.FC<LocationSearchSectionProps> = ({
  isMobile,
  center,
  markerPosition,
  onMapLoad,
  inputValue,
  setInputValue,
  handleEnterKey,
  handlePlaceChanged,
  autocompleteRef,
}) => {
  return (
    <div 
      style={{ 
        flex: isMobile ? 'auto' : 3, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        width: '100%'
      }}
    >
      {/* Search bar */}
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
        options={{ types: ['geocode', 'establishment'] }}
      >
        <input
          type="text"
          placeholder="Select a location"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleEnterKey}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid #ccc',
            fontSize: '16px',
            backgroundColor: '#f3f4f6',
            color: '#111',
            boxSizing: 'border-box',
          }}
        />
      </Autocomplete>

      {/* Map */}
      <div style={{ width: '100%' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={11}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default LocationSearchSection; 