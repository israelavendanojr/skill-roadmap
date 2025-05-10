import { useState } from 'react';
import './InputForm.css';

function InputForm() {
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');
  const [commitment, setCommitment] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [purpose, setPurpose] = useState('');
  const [openCard, setOpenCard] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      learningGoal,
      purpose,
      currentLevel,
      desiredLevel,
      commitment
    });
  };

  const handleCardClick = (card: string) => {
    setOpenCard(openCard === card ? null : card);
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
              className={`form-column ascent-card${openCard === 'base' ? ' open' : ''}`}
              tabIndex={0}
              onClick={() => handleCardClick('base')}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('base'); }}
              role="button"
              aria-expanded={openCard === 'base'}
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
              <div className={`skill-box${openCard === 'base' ? ' expanded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className={`skill-box-content${openCard === 'base' ? ' visible' : ''}`}> 
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="base-none"
                      name="currentLevel"
                      value="None"
                      onChange={(e) => setCurrentLevel(e.target.value)}
                    />
                    <label htmlFor="base-none">No Experience</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="base-beginner"
                      name="currentLevel"
                      value="beginner"
                      onChange={(e) => setCurrentLevel(e.target.value)}
                    />
                    <label htmlFor="base-beginner">Beginner</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="base-intermediate"
                      name="currentLevel"
                      value="intermediate"
                      onChange={(e) => setCurrentLevel(e.target.value)}
                    />
                    <label htmlFor="base-intermediate">Intermediate</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="base-advanced"
                      name="currentLevel"
                      value="advanced"
                      onChange={(e) => setCurrentLevel(e.target.value)}
                    />
                    <label htmlFor="base-advanced">Advanced</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Summit Goal Card */}
            <div
              className={`form-column ascent-card${openCard === 'summit' ? ' open' : ''}`}
              tabIndex={0}
              onClick={() => handleCardClick('summit')}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('summit'); }}
              role="button"
              aria-expanded={openCard === 'summit'}
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
              <div className={`skill-box${openCard === 'summit' ? ' expanded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className={`skill-box-content${openCard === 'summit' ? ' visible' : ''}`}> 
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="summit-beginner"
                      name="desiredLevel"
                      value="beginner"
                      onChange={(e) => setDesiredLevel(e.target.value)}
                    />
                    <label htmlFor="summit-beginner">Beginner</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="summit-intermediate"
                      name="desiredLevel"
                      value="intermediate"
                      onChange={(e) => setDesiredLevel(e.target.value)}
                    />
                    <label htmlFor="summit-intermediate">Intermediate</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="summit-advanced"
                      name="desiredLevel"
                      value="advanced"
                      onChange={(e) => setDesiredLevel(e.target.value)}
                    />
                    <label htmlFor="summit-advanced">Advanced</label>
                  </div>
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="summit-expert"
                      name="desiredLevel"
                      value="expert"
                      onChange={(e) => setDesiredLevel(e.target.value)}
                    />
                    <label htmlFor="summit-expert">Expert</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Trail Time Card */}
            <div
              className={`form-column ascent-card${openCard === 'trail' ? ' open' : ''}`}
              tabIndex={0}
              onClick={() => handleCardClick('trail')}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick('trail'); }}
              role="button"
              aria-expanded={openCard === 'trail'}
            >
              <div className="ascent-icon">
                {/* Trail SVG */}
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 56C16 40 32 40 56 8" stroke="#598294" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M8 56L24 40L40 56" fill="#7BA6B6"/>
                </svg>
              </div>
              <h3 className="column-title ascent-card-title">Trail Time</h3>
              <div className="ascent-card-subtitle">Weekly learning pace</div>
              <div className={`skill-box${openCard === 'trail' ? ' expanded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className={`skill-box-content${openCard === 'trail' ? ' visible' : ''}`}> 
                  <div className="skill-option">
                    <input
                      type="radio"
                      id="casual"
                      name="commitment"
                      value="casual"
                      onChange={(e) => setCommitment(e.target.value)}
                    />
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
                    <label htmlFor="intensive">Intensive (15+ hrs/week)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="action-button primary">
              <span className="button-icon">🚀</span>
              Start Learning Journey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputForm; 