import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import InputForm from './components/InputForm'
import { Mountain } from './components/Mountain'

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [dotCount, setDotCount] = useState(8); // This controls the number of blue dots
  const [climberPosition, setClimberPosition] = useState(0); // Current position of the climber (0 to dotCount-1)
  const [planResult, setPlanResult] = useState<any[]>([]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handlePlanReady = (plan: any) => {
    console.log('App received plan:', plan);
    let planArray;
    if (Array.isArray(plan)) {
      // If array of strings, convert to objects
      if (typeof plan[0] === 'string') {
        planArray = plan.map((step: string, i: number) => ({
          step: step,
          description: '',
          resources: [],
          estimatedTime: ''
        }));
      } else {
        planArray = plan;
      }
    } else if (typeof plan === 'string') {
      // Split string by newlines or numbered steps
      const steps = plan.split(/\n|\r|\d+\./).map(s => s.trim()).filter(Boolean);
      planArray = steps.map((step: string, i: number) => ({
        step: step,
        description: '',
        resources: [],
        estimatedTime: ''
      }));
    } else {
      planArray = [plan];
    }
    setPlanResult(planArray);
    setCurrentTab('home');
  };

  const moveClimberUp = () => {
    if (climberPosition < dotCount - 1) {
      setClimberPosition(climberPosition + 1);
    }
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
              <div className="flex flex-col items-center gap-4">
                <Mountain 
                  dotCount={dotCount}
                  climberPosition={climberPosition}
                  plan={planResult}
                />
                <button
                  onClick={moveClimberUp}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={climberPosition === dotCount - 1}
                >
                  Move Up
                </button>
              </div>
            </div>
          </div>
        )}
        {currentTab === 'explore' && <InputForm onPlanReady={handlePlanReady} />}
        <Navbar onTabChange={handleTabChange} />
      </div>
    </div>
  )
}

export default App