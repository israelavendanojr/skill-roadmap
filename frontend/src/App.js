import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setApiStatus(data.status);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + Flask Demo</h1>
        <div className="api-status">
          <h2>API Status:</h2>
          {apiStatus ? (
            <p style={{ color: 'green' }}>{apiStatus}</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <p>Checking API status...</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
