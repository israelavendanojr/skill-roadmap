import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import InputForm from './components/InputForm'

function App() {
  const [currentTab, setCurrentTab] = useState('home');

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
      </div>
      {currentTab === 'explore' && <InputForm />}
      <Navbar onTabChange={handleTabChange} />
    </div>
  )
}

export default App