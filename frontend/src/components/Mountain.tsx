import { motion } from 'framer-motion';

interface MountainProps {
  dotCount: number; // Number of squares to place along the path
  dotSize?: number;
  dotSpacing?: number;
  pathFunction?: (x: number) => number; // Function to calculate y position from x
  startPoint?: { x: number; y: number }; // Start point of the curve
  endPoint?: { x: number; y: number }; // End point of the curve
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
  dotCount = 10, // This controls the number of squares
  dotSize = 8, 
  dotSpacing = 30,
  pathFunction = defaultPathFunction,
  startPoint = { x: 80, y: 620 },
  endPoint = { x: 500, y: 180 }
}) => {
  const mountainHeight = 600;
  const mountainWidth = 800;
  const pathWidth = 3;
  const curveStrength = 0.5; // Controls how curved the path is

  // Calculate points along the path using the provided function
  const calculatePathPoints = () => {
    const points: { x: number; y: number }[] = [];
    
    // Calculate the x positions for each dot, ensuring they stay within start and end points
    for (let i = 0; i < dotCount; i++) {
      // Create a non-linear distribution that clusters points towards the top
      // Using a quadratic function to make points more dense at the top
      const t = i / (dotCount - 1);
      const tAdjusted = Math.sqrt(t); // This makes points more dense at the top
      
      // Calculate x position based on adjusted t
      const x = startPoint.x + tAdjusted * (endPoint.x - startPoint.x);
      const y = pathFunction(x, startPoint, endPoint);
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





  // Log the start and end points for debugging
  console.log('Start Point:', startPoint);
  console.log('End Point:', endPoint);

  // Calculate points to verify their positions
  const testPoints = calculatePathPoints();
  console.log('Calculated Points:', testPoints);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 border-2 border-red-500">
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

      {/* Start and End Points (Red dots) */}
      <div className="absolute inset-0">
        <motion.div
          className="marker"
          style={{
            left: `${(startPoint.x / mountainWidth) * 100}%`,
            top: `${(startPoint.y / mountainHeight) * 100}%`,
            zIndex: 100, // Ensure dots appear above other elements
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="marker"
          style={{
            left: `${(endPoint.x / mountainWidth) * 100}%`,
            top: `${(endPoint.y / mountainHeight) * 100}%`,
            zIndex: 100, // Ensure dots appear above other elements
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Blue Points */}
      <div className="absolute inset-0">
        {generatePathPoints()}
      </div>

    </div>
  );
};
