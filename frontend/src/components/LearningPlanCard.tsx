import React from 'react';
import { motion } from 'framer-motion';

interface Resource {
  title: string;
  url: string;
  type?: string;
}

interface LearningPlanCardProps {
  step: {
    id?: string;
    title?: string;
    description?: string;
    time_estimate?: string;
    resources?: Resource[];
    difficulty?: string;
    expected_outcome?: string;
    milestone_id?: string;
    // fallback fields
    step?: string;
    estimatedTime?: string;
    [key: string]: any;
  };
  index: number;
}

export const LearningPlanCard: React.FC<LearningPlanCardProps> = ({ step, index }) => {
  // Prefer backend fields, fallback to old ones
  const title = step?.title || step?.step || `Step ${index + 1}`;
  const description = step?.description || 'No description available';
  const resources = Array.isArray(step?.resources) ? step.resources : [];
  const estimatedTime = step?.time_estimate || step?.estimatedTime || 'Time not specified';
  const difficulty = step?.difficulty;
  const expectedOutcome = step?.expected_outcome;

  return (
    <motion.div
      className="learning-plan-card-square"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">Step {index + 1}</span>
      </div>
      <p className="text-gray-600 mb-3">{description}</p>
      {resources.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Resources:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {resources.map((resource, i) => (
              <li key={i}>
                {resource.url ? (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                    {resource.title || resource.url}
                  </a>
                ) : (
                  resource.title
                )}
                {resource.type ? <span className="ml-2 text-xs text-gray-400">[{resource.type}]</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-sm text-gray-500 mb-1">
        Estimated Time: {estimatedTime}
      </div>
      {difficulty && (
        <div className="text-sm text-gray-500 mb-1">
          Difficulty: {difficulty}
        </div>
      )}
      {expectedOutcome && (
        <div className="text-sm text-gray-500 mb-1">
          Outcome: {expectedOutcome}
        </div>
      )}
    </motion.div>
  );
}; 