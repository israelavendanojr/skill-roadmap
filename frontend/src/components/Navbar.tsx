import { useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  onTabChange: (tab: string) => void;
}

function Navbar({ onTabChange }: NavbarProps) {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <nav className="navbar">
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabClick('home')}
        >
          Home
        </button>
        <button 
          className={`nav-tab ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => handleTabClick('explore')}
        >
          Explore
        </button>
        <button 
          className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          Profile
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 