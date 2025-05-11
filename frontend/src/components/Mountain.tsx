import { useState } from 'react';
import { motion } from 'framer-motion';
import './Mountain.css';
import { LearningPlanCard } from './LearningPlanCard';

interface MountainProps {
  dotCount: number; // Number of squares to place along the path
  dotSize?: number;
  dotSpacing?: number;
  pathFunction?: (x: number) => number; // Function to calculate y position from x
  startPoint?: { x: number; y: number }; // Start point of the curve
  endPoint?: { x: number; y: number }; // End point of the curve
  climberPosition?: number; // Position of the climber (0 to dotCount-1)
  plan?: any[]; // The learning plan steps
}

const defaultPathFunction = (x: number, startPoint: { x: number; y: number }, endPoint: { x: number; y: number }) => {
  // Calculate t parameter (0 to 1) based on x position
  const t = (x - startPoint.x) / (endPoint.x - startPoint.x);
  
  // Calculate the curve using a quadratic Bezier curve
  const x1 = startPoint.x;
  const y1 = startPoint.y;
  const x2 = endPoint.x;
  const y2 = endPoint.y;
  
  // Calculate control point for quadratic Bezier
  // Move control point further up and slightly to the right for a wider curve
  const controlPoint = {
    x: (x1 + x2) / 2 + 50, // Shift right by 50 pixels
    y: (y1 + y2) / 2 + 450 // Higher curve by reducing offset
  };
  
  // Calculate quadratic Bezier curve point
  const bezierX = Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * controlPoint.x + Math.pow(t, 2) * x2;
  const bezierY = Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * controlPoint.y + Math.pow(t, 2) * y2;
  
  // Return y value if x matches our input x
  if (Math.abs(bezierX - x) < 1) {
    return bezierY;
  }
  
  // Linear interpolation if x doesn't match exactly
  // Adjust the interpolation to distribute points more evenly
  const tAdjusted = Math.pow(t, 3); // Make the curve more linear at the start
  return startPoint.y + (endPoint.y - startPoint.y) * tAdjusted;
};

export const Mountain: React.FC<MountainProps> = ({ 
  dotCount = 10,
  dotSize = 8, 
  dotSpacing = 30,
  pathFunction = defaultPathFunction,
  startPoint = { x: 80, y: 620 },
  endPoint = { x: 500, y: 180 },
  climberPosition = 0,
  plan = []
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mountainHeight = 600;
  const mountainWidth = 800;

  // Calculate points along the path using the provided function
  const calculatePathPoints = () => {
    const points: { x: number; y: number }[] = [];
    const numPoints = plan && plan.length > 0 ? plan.length : dotCount;
    
    console.log('Calculating points for plan:', plan);
    console.log('Number of points:', numPoints);
    
    // Calculate the x positions for each dot, ensuring they stay within start and end points
    for (let i = 0; i < numPoints; i++) {
      // Create a non-linear distribution that clusters points towards the top
      const t = i / (numPoints - 1);
      const tAdjusted = Math.sqrt(t); // This makes points more dense at the top
      
      // Calculate x position based on adjusted t
      const x = startPoint.x + tAdjusted * (endPoint.x - startPoint.x);
      const y = pathFunction(x, startPoint, endPoint);
      points.push({ x, y });
    }

    return points;
  };

  const points = calculatePathPoints();
  console.log('Generated points:', points);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Mountain Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox={`0 0 ${mountainWidth} ${mountainHeight}`}>
          {/* Mountain Shape */}
          <path
            d={`M0,${mountainHeight} L${mountainWidth / 2},0 L${mountainWidth},${mountainHeight} L0,${mountainHeight} Z`}
            fill="rgba(0,0,0,0.05)"
          />
        </svg>
      </div>

      {/* Blue Points and Plan Cards */}
      <div className="absolute inset-0">
        {/* Dots (expandable) */}
        {points.map((point, i) => {
          const hasStep = plan && plan[i];
          return (
            <div key={`dot-${i}`}>
              <motion.div
                className={`dot${hasStep ? ' cursor-pointer' : ''}`}
                style={{
                  left: `${(point.x / mountainWidth) * 100}%`,
                  top: `${(point.y / mountainHeight) * 100}%`,
                  width: `${dotSize}px`,
                  height: `${dotSize}px`,
                  zIndex: openIndex === i ? 60 : 40,
                  border: openIndex === i ? '3px solid #f59e42' : undefined,
                  boxShadow: openIndex === i ? '0 0 12px #f59e42' : undefined
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => hasStep ? setOpenIndex(openIndex === i ? null : i) : undefined}
                tabIndex={hasStep ? 0 : -1}
                aria-label={hasStep ? `Open step ${i + 1}` : undefined}
                role={hasStep ? 'button' : undefined}
                onKeyDown={hasStep ? (e) => { if (e.key === 'Enter' || e.key === ' ') setOpenIndex(openIndex === i ? null : i); } : undefined}
              />
              {/* Info Card for this step */}
              {openIndex === i && hasStep && (
                <motion.div
                  className="absolute"
                  style={{
                    left: `${(point.x / mountainWidth) * 100}%`,
                    top: `calc(${(point.y / mountainHeight) * 100}% - 80px)`,
                    transform: 'translate(-50%, -100%)',
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <LearningPlanCard step={plan[i]} index={i} />
                </motion.div>
              )}
            </div>
          );
        })}
        
        {/* Climber */}
        {climberPosition !== undefined && points[climberPosition] && (
          <motion.div
            className="climber absolute"
            style={{
              left: `${(points[climberPosition].x / mountainWidth) * 100}%`,
              top: `${(points[climberPosition].y / mountainHeight) * 100}%`,
              zIndex: 200,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src="../images/jose.svg" 
              alt="Climber" 
              className="w-full h-full" 
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};
