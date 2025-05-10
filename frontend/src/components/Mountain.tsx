import { motion } from 'framer-motion';

interface MountainProps {
  dotCount: number; // Number of blue dots to place along the path
  dotSize?: number;
  dotSpacing?: number;
  minPoints?: {
    x: number;
    y: number;
  }[];
  debug?: boolean; // Controls visibility of red dots for debugging
}

const defaultMinPoints = [
  { x: 80, y: 610 },      
  { x: 300, y: 580 },     
  { x: 450, y: 500 },    
  { x: 480, y: 330 }, 
  { x: 500, y: 150 }      
];

export const Mountain: React.FC<MountainProps> = ({ 
  dotCount = 10, // This controls the number of blue dots
  dotSize = 8, 
  dotSpacing = 30,
  minPoints = defaultMinPoints,
  debug = false
}) => {
  const mountainHeight = 600;
  const mountainWidth = 800;
  const pathWidth = 3;
  const curveStrength = 0.5; // Controls how curved the path is

  // Calculate points along the path using Bezier curve
  const calculatePathPoints = () => {
    const points: { x: number; y: number }[] = [];
    
    // Calculate points between each pair of minPoints
    for (let i = 0; i < minPoints.length - 1; i++) {
      const start = minPoints[i];
      const end = minPoints[i + 1];
      const controlPoint = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      };
      
      // Calculate how many points to place between this pair
      const pointsBetween = Math.floor(dotCount / (minPoints.length - 1));
      
      // Add points between start and control point
      for (let j = 0; j <= pointsBetween / 2; j++) {
        const t = j / (pointsBetween / 2);
        const x = Math.pow(1 - t, 2) * start.x + 
                 2 * (1 - t) * t * controlPoint.x + 
                 Math.pow(t, 2) * controlPoint.x;
        const y = Math.pow(1 - t, 2) * start.y + 
                 2 * (1 - t) * t * controlPoint.y + 
                 Math.pow(t, 2) * controlPoint.y;
        points.push({ x, y });
      }
      
      // Add points between control point and end
      for (let j = 0; j <= pointsBetween / 2; j++) {
        const t = j / (pointsBetween / 2);
        const x = Math.pow(1 - t, 2) * controlPoint.x + 
                 2 * (1 - t) * t * end.x + 
                 Math.pow(t, 2) * end.x;
        const y = Math.pow(1 - t, 2) * controlPoint.y + 
                 2 * (1 - t) * t * end.y + 
                 Math.pow(t, 2) * end.y;
        points.push({ x, y });
      }
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

  // Generate minimum points
  const generateMinPoints = () => {
    return minPoints.map((point, i) => (
      <motion.div
        key={i}
        className="min-point"
        style={{
          left: `${(point.x / mountainWidth) * 100}%`,
          top: `${(point.y / mountainHeight) * 100}%`,
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: debug ? 1 : 0, scale: debug ? 1 : 0 }}
        transition={{ delay: i * 0.1 }}
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

      {/* Minimum Points (Debug) */}
      {debug && (
        <div className="absolute inset-0">
          {generateMinPoints()}
        </div>
      )}
    </div>
  );
};
