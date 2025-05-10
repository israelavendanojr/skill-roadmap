import React from 'react';
import { RefObject } from 'react';
import { categories } from '../constants';

interface ResultsSectionProps {
  showResults: boolean;
  resultsRef: RefObject<HTMLDivElement>;
  isMobile: boolean;
  selectedCategories: string[];
  radiusInMiles: number;
  agentResponse: any;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  showResults,
  resultsRef,
  isMobile,
  selectedCategories,
  radiusInMiles,
  agentResponse
}) => {
  if (!showResults) return null;

  console.log('ResultsSection received agentResponse:', agentResponse);

  // Get recommendations from agent response
  const recommendations = agentResponse?.recommendations || [];
  console.log('Extracted recommendations:', recommendations);
  
  // If no recommendations, show a message
  const hasRecommendations = recommendations.length > 0;
  console.log('Has recommendations:', hasRecommendations);

  return (
    <div
      ref={resultsRef}
      style={{
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '1200px',
        margin: '32px auto 0',
        boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
      }}
    >
      <div
        style={{
          backgroundColor: '#f0f7ff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #d1e4ff',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              color: '#1e40af',
            }}
          >
            Top Places to Explore
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '12px'
            }}
          >
            <span
              style={{
                fontSize: '13px',
                padding: '6px 12px',
                backgroundColor: '#dbeafe',
                borderRadius: '20px',
                color: '#1e40af',
                fontWeight: 500,
              }}
            >
              {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'}
            </span>
            <span
              style={{
                fontSize: '13px',
                padding: '6px 12px',
                backgroundColor: '#dbeafe',
                borderRadius: '20px',
                color: '#1e40af',
                fontWeight: 500,
              }}
            >
              {radiusInMiles} {radiusInMiles === 1 ? 'mile' : 'miles'} radius
            </span>
          </div>
        </div>
        
        {!hasRecommendations ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#6b7280',
            fontSize: '16px'
          }}>
            No recommendations found. Try adjusting your search criteria.
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? '1fr' 
                : 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px' 
            }}
          >
            {recommendations.map((place: any, index: number) => {
              console.log('Rendering place:', place);
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '14px',
                    padding: '20px',
                    fontSize: '16px',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e5e7eb',
                    color: '#374151',
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'flex-start',
                    textAlign: 'left'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>
                      {place.name || `Place ${index + 1}`}
                    </h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                      {place.address || 'Address not available'}
                    </p>
                    {place.rating && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px'
                      }}>
                        <span style={{ color: '#f59e0b' }}>★</span>
                        <span style={{ fontSize: '14px' }}>{place.rating}</span>
                      </div>
                    )}
                    {/* Show categories in each place card */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginTop: '8px'
                    }}>
                      {selectedCategories.map(catId => (
                        <span 
                          key={catId}
                          style={{
                            fontSize: '13px',
                            padding: '4px 8px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '6px',
                            color: '#4b5563'
                          }}
                        >
                          {categories.find(c => c.id === catId)?.icon} {categories.find(c => c.id === catId)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsSection; 