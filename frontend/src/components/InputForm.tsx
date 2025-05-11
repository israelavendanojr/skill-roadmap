import { useState } from 'react';
import './InputForm.css';
import ClimberIcon from '../art/climbers/z.svg';

const LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

interface InputFormProps {
  onPlanReady: (plan: any) => void;
}

function InputForm({ onPlanReady }: InputFormProps) {
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');
  const [commitment, setCommitment] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [purpose, setPurpose] = useState('');
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      skill: learningGoal,
      goalReason: purpose,
      currentLevel,
      targetLevel: desiredLevel,
      commitment,
    };
    try {
      console.log('Sending payload:', payload);
      const response = await fetch('http://localhost:5050/api/goal-planner/create-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create plan');
        setLoading(false);
        return;
      }
      const data = await response.json();
      console.log('Received plan data:', data);
      onPlanReady(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (card: string) => {
    setOpenCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(card)) {
        newSet.delete(card);
      } else {
        newSet.add(card);
      }
      return newSet;
    });
  };

  // Helper to determine if a summit level should be disabled
  const isSummitDisabled = (level: string) => {
    if (!currentLevel) return false;
    const currentIdx = LEVELS.indexOf(currentLevel);
    const summitIdx = LEVELS.indexOf(level);
    return summitIdx <= currentIdx && currentIdx !== -1;
  };

  return (
    <div className="input-form-page mountain-bg">
      <div className="input-form-content">
        <h2 className="form-title ascent-title">Plan Your Learning Ascent</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Text Input Section */}
          <div className="text-input-section ascent-inputs">
            <div className="text-input-group">
              <span className="input-prefix">I want to learn</span>
              <input
                type="text"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="text-input"
                placeholder="e.g., Python programming, Digital Marketing, etc."
              />
            </div>
            <div className="text-input-group">
              <span className="input-prefix">To do</span>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="text-input"
                placeholder="e.g., build a website, start a business, etc."
              />
            </div>
          </div>

          {/* Card Columns Section */}
          <div className="form-columns ascent-cards">
            {/* Base Camp Card */}
            <div
              className={`form-column ascent-card${openCards.has('base') ? ' open' : ''}`}
              tabIndex={0}
              onClick={() => handleCardClick('base')}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('base'); }}
              role="button"
              aria-expanded={openCards.has('base')}
            >
              <div className="ascent-icon">
                {/* Mountain SVG */}
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 56L28 24L40 40L48 32L56 56H8Z" fill="#7BA6B6"/>
                  <path d="M28 24L40 40L48 32" stroke="#598294" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="column-title ascent-card-title">Base Camp</h3>
              <div className="ascent-card-subtitle">Choose your current level</div>
              <div className={`skill-box${openCards.has('base') ? ' expanded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className={`skill-box-content${openCards.has('base') ? ' visible' : ''}`}> 
                <div className="skill-option">
                    <input
                      type="radio"
                      id="base-None"
                      name="currentLevel"
                      value="None"
                      onChange={(e) => {
                        setCurrentLevel(e.target.value);
                        setDesiredLevel('');
                      }}
                      checked={currentLevel === 'None'}
                      readOnly
                    />
                    <span className="custom-radio">{currentLevel === 'None' ? '✓' : ''}</span>
                    <label htmlFor="base-None">No Experience</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="base-beginner"
                      name="currentLevel"
                      value="beginner"
                      onChange={(e) => {
                        setCurrentLevel(e.target.value);
                        setDesiredLevel('');
                      }}
                      checked={currentLevel === 'beginner'}
                      readOnly
                    />
                    <span className="custom-radio">{currentLevel === 'beginner' ? '✓' : ''}</span>
                    <label htmlFor="base-beginner">Beginner</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="base-intermediate"
                      name="currentLevel"
                      value="intermediate"
                      onChange={(e) => {
                        setCurrentLevel(e.target.value);
                        setDesiredLevel('');
                      }}
                      checked={currentLevel === 'intermediate'}
                      readOnly
                    />
                    <span className="custom-radio">{currentLevel === 'intermediate' ? '✓' : ''}</span>
                    <label htmlFor="base-intermediate">Intermediate</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="base-advanced"
                      name="currentLevel"
                      value="advanced"
                      onChange={(e) => {
                        setCurrentLevel(e.target.value);
                        setDesiredLevel('');
                      }}
                      checked={currentLevel === 'advanced'}
                      readOnly
                    />
                    <span className="custom-radio">{currentLevel === 'advanced' ? '✓' : ''}</span>
                    <label htmlFor="base-advanced">Advanced</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Summit Goal Card */}
            <div
              className={`form-column ascent-card${openCards.has('summit') ? ' open' : ''}`}
              tabIndex={0}
              onClick={() => handleCardClick('summit')}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('summit'); }}
              role="button"
              aria-expanded={openCards.has('summit')}
            >
              <div className="ascent-icon">
                {/* Summit/Flag SVG */}
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 56L32 28L44 44L52 36L60 56H12Z" fill="#7BA6B6"/>
                  <path d="M32 28L44 44L52 36" stroke="#598294" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M32 28V12" stroke="#598294" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M32 12L40 16L32 20V12Z" fill="#598294"/>
                </svg>
              </div>
              <h3 className="column-title ascent-card-title">Summit Goal</h3>
              <div className="ascent-card-subtitle">Your destination skill</div>
              <div className={`skill-box${openCards.has('summit') ? ' expanded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className={`skill-box-content${openCards.has('summit') ? ' visible' : ''}`}> 
                  {LEVELS.map(level => {
                    const disabled = isSummitDisabled(level);
                    const checked = desiredLevel === level;
                    return (
                      <div className={`skill-option${disabled ? ' disabled' : ''}`} key={level}>
                        <input
                          type="radio"
                          id={`summit-${level}`}
                          name="desiredLevel"
                          value={level}
                          onChange={(e) => setDesiredLevel(e.target.value)}
                          disabled={disabled}
                          checked={checked}
                          readOnly
                        />
                        <span className="custom-radio">
                          {disabled ? '✕' : checked ? '✓' : ''}
                        </span>
                        <label htmlFor={`summit-${level}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Trail Time Card */}
            <div
              className={`form-column ascent-card${openCards.has('trail') ? ' open' : ''}`}
              tabIndex={0}
              onClick={() => handleCardClick('trail')}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('trail'); }}
              role="button"
              aria-expanded={openCards.has('trail')}
            >
              <div className="ascent-icon">
                {/* Trail SVG */}
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 56L32 28L44 44L52 36L60 56H12Z" fill="#7BA6B6"/>
                  <path d="M32 28L44 44L52 36" stroke="#598294" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M32 28V12" stroke="#598294" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M32 12L40 16L32 20V12Z" fill="#598294"/>
                </svg>
              </div>
              <h3 className="column-title ascent-card-title">Trail Time</h3>
              <div className="ascent-card-subtitle">Choose your commitment level</div>
              <div className={`skill-box${openCards.has('trail') ? ' expanded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className={`skill-box-content${openCards.has('trail') ? ' visible' : ''}`}> 
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="casual"
                      name="commitment"
                      value="casual"
                      onChange={(e) => setCommitment(e.target.value)}
                    />
                    <span className="custom-radio">{commitment === 'casual' ? '✓' : ''}</span>
                    <label htmlFor="casual">Casual (1-2 hrs/week)</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="dedicated"
                      name="commitment"
                      value="dedicated"
                      onChange={(e) => setCommitment(e.target.value)}
                    />
                    <span className="custom-radio">{commitment === 'dedicated' ? '✓' : ''}</span>
                    <label htmlFor="dedicated">Dedicated (5-10 hrs/week)</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="intensive"
                      name="commitment"
                      value="intensive"
                      onChange={(e) => setCommitment(e.target.value)}
                    />
                    <span className="custom-radio">{commitment === 'intensive' ? '✓' : ''}</span>
                    <label htmlFor="intensive">Intensive (15+ hrs/week)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="action-button primary" disabled={loading}>
              Start your climb!
              <span className="button-icon"><img src={ClimberIcon} alt="Climber" /></span>
            </button>
          </div>
        </form>
        {loading && <div className="plan-status">Loading...</div>}
        {error && <div className="plan-status error">{error}</div>}
      </div>
    </div>
  );
}

export default InputForm;