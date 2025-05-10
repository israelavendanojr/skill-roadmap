import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import InputForm from './components/InputForm'
import { Mountain } from './components/Mountain'

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [dotCount, setDotCount] = useState(10); // This will be dynamically set from backend later

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
            <Mountain dotCount={dotCount} />
          </div>
        )}
        {currentTab === 'explore' && <InputForm />}
        <Navbar onTabChange={handleTabChange} />
      </div>
    </div>
  )
}

export default App