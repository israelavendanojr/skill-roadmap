import { useState } from 'react';
import './InputForm.css';

function InputForm() {
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');
  const [commitment, setCommitment] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [purpose, setPurpose] = useState('');

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

  return (
    <div className="input-form-page">
      <div className="input-form-content">
        <h2 className="form-title">Explore Your Path</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Text Input Section */}
          <div className="text-input-section">
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
              <span className="input-prefix">to do</span>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="text-input"
                placeholder="e.g., build a website, start a business, etc."
              />
            </div>
          </div>

          {/* Three Columns Section */}
          <div className="form-columns">
            {/* Current Skill Level Column */}
            <div className="form-column">
              <h3 className="column-title">Current Skill Level</h3>
              <div className="skill-box">
                <div className="skill-option">
                  <input
                    type="radio"
                    id="beginner"
                    name="currentLevel"
                    value="beginner"
                    onChange={(e) => setCurrentLevel(e.target.value)}
                  />
                  <label htmlFor="beginner">Beginner</label>
                </div>
                <div className="skill-option">
                  <input
                    type="radio"
                    id="intermediate"
                    name="currentLevel"
                    value="intermediate"
                    onChange={(e) => setCurrentLevel(e.target.value)}
                  />
                  <label htmlFor="intermediate">Intermediate</label>
                </div>
                <div className="skill-option">
                  <input
                    type="radio"
                    id="advanced"
                    name="currentLevel"
                    value="advanced"
                    onChange={(e) => setCurrentLevel(e.target.value)}
                  />
                  <label htmlFor="advanced">Advanced</label>
                </div>
              </div>
            </div>

            {/* Desired Proficiency Column */}
            <div className="form-column">
              <h3 className="column-title">Desired Proficiency</h3>
              <div className="skill-box">
                <div className="skill-option">
                  <input
                    type="radio"
                    id="proficient"
                    name="desiredLevel"
                    value="proficient"
                    onChange={(e) => setDesiredLevel(e.target.value)}
                  />
                  <label htmlFor="proficient">Proficient</label>
                </div>
                <div className="skill-option">
                  <input
                    type="radio"
                    id="expert"
                    name="desiredLevel"
                    value="expert"
                    onChange={(e) => setDesiredLevel(e.target.value)}
                  />
                  <label htmlFor="expert">Expert</label>
                </div>
                <div className="skill-option">
                  <input
                    type="radio"
                    id="master"
                    name="desiredLevel"
                    value="master"
                    onChange={(e) => setDesiredLevel(e.target.value)}
                  />
                  <label htmlFor="master">Master</label>
                </div>
              </div>
            </div>

            {/* Commitment Column */}
            <div className="form-column">
              <h3 className="column-title">Learning Commitment</h3>
              <div className="skill-box">
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