import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const ScrollLine = ({ isDark }) => {
  const { scrollYProgress } = useScroll();
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate coordinates for the "leading dot"
  // Since we are using preserveAspectRatio="none" on a 0 0 100 100 viewBox, 
  // we need to query the SVG path element for the point at the current length.
  const [dotPos, setDotPos] = useState({ x: 50, y: 0 });

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Use a custom frame loop to update the dot position because useTransform 
  // doesn't directly map progress to SVG getPointAtLength.
  useEffect(() => {
    if (!pathRef.current || pathLength === 0) return;

    return smoothProgress.onChange((latest) => {
      const currentLength = latest * pathLength;
      const point = pathRef.current.getPointAtLength(currentLength);
      // The point coordinates are in the 0-100 viewBox coordinate system
      setDotPos({ x: point.x, y: point.y });
    });
  }, [smoothProgress, pathLength]);

  // A semi-random winding path that goes from top (y=0) to bottom (y=100)
  // X values weave left and right
  const d = "M 50 0 C 80 20, 20 40, 50 50 C 80 60, 20 80, 50 100";
  
  // Neon green color for the "energy"
  const strokeColor = "#00FF66";

  return (
    <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-60">
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,102,0.8)]"
      >
        {/* Background track (optional, very faint) */}
        <path 
          d={d}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}
          strokeWidth="0.2"
        />
        
        {/* The dynamic glowing line */}
        <motion.path 
          ref={pathRef}
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.3"
          strokeLinecap="round"
          style={{ 
            pathLength: smoothProgress,
          }}
        />

        {/* The leading dot */}
        <motion.circle
          cx={dotPos.x}
          cy={dotPos.y}
          r="1"
          fill={strokeColor}
          className="drop-shadow-[0_0_20px_#00FF66]"
        />
        
        {/* Inner intense core of the dot */}
        <motion.circle
          cx={dotPos.x}
          cy={dotPos.y}
          r="0.4"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};

export default ScrollLine;
