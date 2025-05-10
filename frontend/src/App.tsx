import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import InputForm from './components/InputForm'
import { Mountain } from './components/Mountain'

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [dotCount, setDotCount] = useState(100); // This controls the number of blue dots
  const [debug, setDebug] = useState(false); // Toggle debug mode to show/hide red dots

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <div className="background-container">
      <div className="app-container">
        <div className="title-section">
          <h1 className="app-title">Pathora</h1>
          <div className="title-underline"></div>
        </div>
        {currentTab === 'home' && (
          <div className="mountain-container">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Number of Blue Dots: {dotCount}</span>
                
              </div>
              <Mountain 
                dotCount={dotCount} 
                debug={debug}
              />
            </div>
          </div>
        )}
        {currentTab === 'explore' && <InputForm />}
        <Navbar onTabChange={handleTabChange} />
      </div>
    </div>
  )
}

export default App