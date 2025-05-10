import { motion } from 'framer-motion';

interface MountainProps {
  dotCount: number;
  dotSize?: number;
  dotSpacing?: number;
  minPoints?: {
    x: number;
    y: number;
  }[];
}

const defaultMinPoints = [
  { x: 80, y: 610 },      
  { x: 300, y: 580 },     
  { x: 450, y: 500 },    
  { x: 480, y: 330 }, 
  { x: 500, y: 150 }      
];

export const Mountain: React.FC<MountainProps> = ({ 
  dotCount = 10, 
  dotSize = 8, 
  dotSpacing = 30,
  minPoints = defaultMinPoints
}) => {
  const mountainHeight = 600;
  const mountainWidth = 800;
  const pathWidth = 3;
  const curveStrength = 0.5; // Controls how curved the path is

  // Calculate the path points for the mountain
  const calculatePathPoints = () => {
    const points: string[] = minPoints.map(point => `${point.x},${point.y}`);
    return points.join(' ');
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
        animate={{ opacity: 1, scale: 1 }}
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
          
          {/* Path */}
          <path
            d={`M${pathWidth / 2},${mountainHeight} ${calculatePathPoints()} L${mountainWidth - pathWidth / 2},${mountainHeight} Z`}
            fill="rgba(0,0,0,0.1)"
          />
        </svg>
      </div>



      {/* Minimum Points */}
      <div className="absolute inset-0">
        {generateMinPoints()}
      </div>
    </div>
  );
};
