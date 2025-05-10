import React from 'react';
import { CategoryType } from '../types';
import { categories } from '../constants';

interface SearchOptionsProps {
  isMobile: boolean;
  radiusInMiles: number;
  handleRadiusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCategories: string[];
  handleCategoryToggle: (categoryId: string) => void;
  onSearchOptionsChange?: (options: SearchOptionsData) => void;
  location?: string;
}

// Define the structure of our search options data
export interface SearchOptionsData {
  location: string;
  radius: number;
  categories: string[];

}

const SearchOptions: React.FC<SearchOptionsProps> = ({
  isMobile,
  radiusInMiles,
  handleRadiusChange,
  selectedCategories,
  handleCategoryToggle,
  onSearchOptionsChange,
  location = '',
}) => {
  // Function to aggregate the current search options into a JSON format
  const aggregateSearchOptions = () => {
    const options: SearchOptionsData = {
      location: location,
      radius: radiusInMiles,
      categories: selectedCategories,
    };
    
    // If the parent component provided a callback, call it with the aggregated data
    if (onSearchOptionsChange) {
      onSearchOptionsChange(options);
    }
    
    return options;
  };

  // Call aggregateSearchOptions whenever the options change
  React.useEffect(() => {
    aggregateSearchOptions();
  }, [radiusInMiles, selectedCategories, location]);

  return (
    <div 
      style={{ 
        flex: isMobile ? 'auto' : 1, 
        width: '100%',
        height: isMobile ? 'auto' : '400px', // Match height with map
      }}
    >
      {/* Options Section */}
      <div 
        className="options-section"
        style={{
          backgroundColor: '#f0f7ff',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #d1e4ff',
          minWidth: isMobile ? 'auto' : '250px',
          boxSizing: 'border-box',
          width: '100%',
          height: isMobile ? 'auto' : '475px', // Medium height
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ 
          fontSize: '22px', 
          marginTop: 0, 
          marginBottom: '20px',
          color: '#1e40af',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          Options
        </h2>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          flex: 1 // Fill available space
        }}>
          {/* Radius Slider */}
          <div style={{ padding: '0 10px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{ 
                fontWeight: 500,
                color: '#374151',
                fontSize: '14px'
              }}>
                Search Radius
              </label>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                {radiusInMiles} {radiusInMiles === 1 ? 'mile' : 'miles'}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={radiusInMiles}
              onChange={handleRadiusChange}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#e5e7eb',
                outline: 'none',
                transition: 'all 0.3s ease',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
          
          {/* Categories - with multi-select */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ 
              marginBottom: '10px',
              fontWeight: 500,
              color: '#4b5563'
            }}>
              Categories: <span style={{ fontSize: '13px', color: '#6b7280' }}>(select all that apply)</span>
            </p>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              flex: 1,
              marginBottom: '10px'
            }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: selectedCategories.includes(category.id) 
                      ? '#2563eb' 
                      : 'white',
                    color: selectedCategories.includes(category.id)
                      ? 'white'
                      : '#4b5563',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOptions; 