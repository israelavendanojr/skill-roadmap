import { motion } from 'framer-motion';

interface MountainProps {
  dotCount: number; // Number of squares to place along the path
  dotSize?: number;
  dotSpacing?: number;
  pathFunction?: (x: number) => number; // Function to calculate y position from x
  debug?: boolean; // Controls visibility of red dots for debugging
}

const defaultPathFunction = (x: number) => {
  // Simple quadratic function that creates a mountain-like curve
  // Adjust the coefficients to change the shape
  const a = -0.0015; // Controls the steepness
  const b = 0.008;    // Controls the position
  const c = 600;     // Controls the height
  return a * Math.pow(x, 2) + b * x + c;
};

export const Mountain: React.FC<MountainProps> = ({ 
  dotCount = 10, // This controls the number of squares
  dotSize = 8, 
  dotSpacing = 30,
  pathFunction = defaultPathFunction,
  debug = false
}) => {
  const mountainHeight = 600;
  const mountainWidth = 800;
  const pathWidth = 3;
  const curveStrength = 0.5; // Controls how curved the path is

  // Calculate points along the path using the provided function
  const calculatePathPoints = () => {
    const points: { x: number; y: number }[] = [];
    const mountainWidth = 800;
    
    // Calculate the x positions for each dot
    for (let i = 0; i < dotCount; i++) {
      // Distribute dots evenly across the width
      const x = (i / (dotCount - 1)) * mountainWidth;
      const y = pathFunction(x);
      points.push({ x, y });
    }

    return points;
  };

  // Generate blue points along the path
  const generatePathPoints = () => {
    const points = calculatePathPoints();
    
    return points.map((point, i) => (
      <motion.div
        key={`path-${i}`}
        className="dot"
        style={{
          left: `${(point.x / mountainWidth) * 100}%`,
          top: `${(point.y / mountainHeight) * 100}%`,
          width: `${dotSize}px`,
          height: `${dotSize}px`,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.05 }}
      />
    ));
  };





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



      {/* Blue Points */}
      <div className="absolute inset-0">
        {generatePathPoints()}
      </div>

    </div>
  );
};
