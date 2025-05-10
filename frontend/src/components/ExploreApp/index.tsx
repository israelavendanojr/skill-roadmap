import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { MapPosition, ChatMessage } from './types';
import { initialCenter } from './constants';
import { SearchOptionsData } from './components/SearchOptions';

// Import Components
import LocationSearchSection from './components/LocationSearchSection';
import SearchOptions from './components/SearchOptions';
import NotesSection from './components/NotesSection';
import ResultsSection from './components/ResultsSection';
import ChatWidget from './components/ChatWidget';

function ExploreApp() {
  const [center, setCenter] = useState<MapPosition>(initialCenter);
  const [markerPosition, setMarkerPosition] = useState<MapPosition>(initialCenter);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [notesValue, setNotesValue] = useState<string>('');
  const [radiusInMiles, setRadiusInMiles] = useState<number>(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['entertainment']);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchOptionsData, setSearchOptionsData] = useState<SearchOptionsData>({
    location: '',
    radius: 5,
    categories: ['entertainment'],
  });
  
  // Chat state
  const [showChat, setShowChat] = useState<boolean>(false);
  const [minimizeChat, setMinimizeChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'agent',
      text: 'Hi there! I\'m Venture, your personal guide. Need help exploring the places I found for you?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [agentResponse, setAgentResponse] = useState<any>(null);

  // References
  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Load API key
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    setApiKey(key || '');
    if (!key) {
      setError('API key not found. Check your .env file.');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Create the initial circle
    updateCircle(radiusInMiles);
  }, [radiusInMiles]);

  // Function to update or create the circle
  const updateCircle = useCallback((radius: number) => {
    const radiusInMeters = radius * 1609.34;
    
    // If a circle already exists, remove it
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    
    // Only create a new circle if radius is greater than 0 and map exists
    if (radius > 0 && mapRef.current) {
      // Circle options
      const circleOptions: google.maps.CircleOptions = {
        strokeColor: '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'rgba(66, 133, 244, 0.15)',
        fillOpacity: 0.35,
        map: mapRef.current,
        center: markerPosition,
        radius: radiusInMeters
      };
      
      // Create a new circle
      circleRef.current = new google.maps.Circle(circleOptions);

      // Calculate and set appropriate zoom level
      const bounds = new google.maps.LatLngBounds();
      const center = new google.maps.LatLng(markerPosition.lat, markerPosition.lng);
      const north = google.maps.geometry.spherical.computeOffset(center, radiusInMeters, 0);
      const south = google.maps.geometry.spherical.computeOffset(center, radiusInMeters, 180);
      const east = google.maps.geometry.spherical.computeOffset(center, radiusInMeters, 90);
      const west = google.maps.geometry.spherical.computeOffset(center, radiusInMeters, 270);
      
      bounds.extend(north);
      bounds.extend(south);
      bounds.extend(east);
      bounds.extend(west);
      
      // Use proper padding type for fitBounds
      const padding = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      };
      
      mapRef.current.fitBounds(bounds, padding);
    }
  }, [markerPosition]);

  // Update circle when radius changes
  useEffect(() => {
    updateCircle(radiusInMiles);
  }, [radiusInMiles, updateCircle]);

  // Update circle when position changes
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setCenter(markerPosition);
    }
  }, [markerPosition]);

  // Clean up circle on unmount
  useEffect(() => {
    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, []);

  const updateMapPosition = (location: google.maps.LatLng) => {
    const newPos = {
      lat: location.lat(),
      lng: location.lng(),
    };
    
    setCenter(newPos);
    setMarkerPosition(newPos);
    
    // Update circle position
    if (circleRef.current) {
      circleRef.current.setCenter(newPos);
    }
    
    setError('');
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry) {
      setError('Place not found.');
      return;
    }
    setInputValue(place.formatted_address || '');
    updateMapPosition(place.geometry.location);
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (window.google && window.google.maps && inputValue.trim()) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: inputValue }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            updateMapPosition(results[0].geometry.location);
          } else {
            setError('Location not found. Try a different address.');
          }
        });
      }
    }
  };

  // Multi-select category toggle
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Handle radius slider change
  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value);
    setRadiusInMiles(newRadius);
  };

  // Update searchOptionsData when inputValue changes
  useEffect(() => {
    setSearchOptionsData(prev => ({
      ...prev,
      location: inputValue
    }));
  }, [inputValue]);

  // Handle search options change
  const handleSearchOptionsChange = (options: SearchOptionsData) => {
    setSearchOptionsData(options);
  };

  // Handle search button click
  const handleSearch = async () => {
    if (inputValue.trim()) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: inputValue }, async (results, status) => {
        if (status === 'OK' && results && results[0]) {
          updateMapPosition(results[0].geometry.location);
          
          try {
            console.log('Sending request with data:', {
              location: searchOptionsData.location,
              interest: searchOptionsData.categories.join(', '),
              time: '',
              date: '',
              radius: radiusInMiles,
              notes: notesValue
            });

            const response = await fetch('http://127.0.0.1:5000/handle_preferences', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                location: searchOptionsData.location,
                interest: searchOptionsData.categories.join(', '),
                time: '',
                date: '',
                radius: radiusInMiles,
                notes: notesValue
              })
            });

            if (!response.ok) {
              throw new Error('Failed to get response from server');
            }

            const data = await response.json();
            console.log('Backend response:', data);
            console.log('Setting agent response:', data);
            setAgentResponse(data);  // Store the agent's response
            
            setShowResults(true);
            setShowChat(true);
            setMinimizeChat(true);
            setTimeout(() => {
              resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } catch (error) {
            console.error('Error:', error);
            setError('Failed to get recommendations. Please try again.');
          }
        } else {
          setError('Location not found. Try a different address.');
        }
      });
    } else if (!inputValue.trim()) {
      setError('Please enter a location to search.');
    } else {
      setShowResults(true);
      setShowChat(true);
      setMinimizeChat(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return apiKey ? (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places', 'geometry']}>
      <div className="explore-container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        marginBottom: '60px',
        position: 'relative'
      }}>
        {/* Main Explorer Container */}
        <div
          className="explore-main"
          style={{
            backgroundColor: '#fff',
            borderRadius: '24px',
            padding: '32px',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Map and Options in a flex container */}
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '24px',
                alignItems: 'flex-start',
              }}
            >
              {/* Left side - Map and Search */}
              <LocationSearchSection 
                isMobile={isMobile}
                center={center}
                markerPosition={markerPosition}
                onMapLoad={onMapLoad}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleEnterKey={handleEnterKey}
                handlePlaceChanged={handlePlaceChanged}
                autocompleteRef={autocompleteRef}
              />

              {/* Right side - Options */}
              <SearchOptions 
                isMobile={isMobile}
                radiusInMiles={radiusInMiles}
                handleRadiusChange={handleRadiusChange}
                selectedCategories={selectedCategories}
                handleCategoryToggle={handleCategoryToggle}
                onSearchOptionsChange={handleSearchOptionsChange}
                location={inputValue}
              />
            </div>

            {/* Notes section and Search button */}
            <NotesSection 
              isMobile={isMobile}
              notesValue={notesValue}
              setNotesValue={setNotesValue}
              handleSearch={handleSearch}
              error={error}
            />
          </div>
        </div>

        {/* Results section - Separate container and only shown after search */}
        <ResultsSection 
          showResults={showResults}
          resultsRef={resultsRef}
          isMobile={isMobile}
          selectedCategories={selectedCategories}
          radiusInMiles={radiusInMiles}
          agentResponse={agentResponse}
        />
        
        {/* Chat Widget */}
        <ChatWidget 
          showChat={showChat}
          minimizeChat={minimizeChat}
          setMinimizeChat={setMinimizeChat}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
        />
      </div>
    </LoadScript>
  ) : (
    <div
      style={{
        height: '500px',
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
      }}
    >
      Loading map...
    </div>
  );
}

export default ExploreApp; 