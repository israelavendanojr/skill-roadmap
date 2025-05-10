import React from 'react';

interface NotesSectionProps {
  isMobile: boolean;
  notesValue: string;
  setNotesValue: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  error: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  isMobile,
  notesValue,
  setNotesValue,
  handleSearch,
  error,
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      gap: '16px',
      alignItems: isMobile ? 'stretch' : 'flex-end',
      justifyContent: 'space-between',
      marginTop: '0px' // Removed margin completely
    }}>
      <div style={{ flex: '1' }}>
        <div style={{
          backgroundColor: '#f0f7ff',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #d1e4ff',
        }}>
          <h2 style={{ 
            fontSize: '22px', 
            marginTop: 0, 
            marginBottom: '20px',
            color: '#1e40af',
            fontWeight: 600,
            textAlign: 'left'
          }}>
            Additional Information
          </h2>
          <textarea
            placeholder="Add any additional notes or preferences..."
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              minHeight: '80px',
              fontSize: '16px',
              resize: 'vertical',
              backgroundColor: '#f9fafb',
              color: '#111',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
      <button
        onClick={handleSearch}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 32px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          height: 'fit-content',
          boxShadow: '0 4px 6px rgba(37, 99, 235, 0.1)',
          whiteSpace: 'nowrap',
        }}
      >
        Search
      </button>
      
      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
    </div>
  );
};

export default NotesSection; 