import { useState } from 'react';
import './InputForm.css';

function InputForm() {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted with value:', inputValue);
  };

  return (
    <div className="input-form-page">
      <div className="input-form-content">
        <h2 className="form-title">Explore Your Path</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input-group">
            <label htmlFor="pathInput" className="input-label">Enter your destination</label>
            <div className="input-wrapper">
              <span className="input-prefix">I want to learn</span>
              <input
                type="text"
                id="pathInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-input"
                placeholder="Type your destination here..."
              />
            </div>
          </div>
          
          <div className="button-group">
            <button type="button" className="action-button secondary">
              <span className="button-icon">🗺️</span>
              Use Current Location
            </button>
            <button type="button" className="action-button secondary">
              <span className="button-icon">🔍</span>
              Browse Destinations
            </button>
            <button type="submit" className="action-button primary">
              <span className="button-icon">🚀</span>
              Start Journey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputForm; 