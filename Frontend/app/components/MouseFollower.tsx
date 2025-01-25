'use client'
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function MouseFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [trail, setTrail] = useState<{ x: number; y: number; }[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 200 }; // Increased stiffness
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    let moveTimeoutId: NodeJS.Timeout | null = null;
    let lastPosition = { x: -100, y: -100 };
    
    const moveCursor = (e: MouseEvent) => {
      const newPosition = { x: e.clientX - 16, y: e.clientY - 16 };
      lastPosition = newPosition;
      
      cursorX.set(newPosition.x);
      cursorY.set(newPosition.y);
      setIsMoving(true);
      
      // Add new position to trail
      setTrail(prevTrail => [
        newPosition,
        ...prevTrail.slice(0, 10) // Reduced trail length for better performance
      ]);

      // Clear previous timeout
      if (moveTimeoutId) clearTimeout(moveTimeoutId);

      // Reset after movement stops
      moveTimeoutId = setTimeout(() => {
        setIsMoving(false);
        setTrail([]);  // Clear trail when static
      }, 100);
    };

    const handleMouseLeave = () => {
      setTrail([]);
      cursorX.set(-100);
      cursorY.set(-100);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (moveTimeoutId) clearTimeout(moveTimeoutId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Trail effect */}
      {trail.map((position, index) => (
        <motion.div
          key={index}
          className="fixed rounded-full"
          style={{
            width: Math.max(8, 24 - index * 2), // Slightly smaller trail
            height: Math.max(8, 24 - index * 2),
            x: position.x,
            y: position.y,
            opacity: 0.3 - index * 0.02, // More consistent opacity
            background: `rgba(255, 255, 255, ${0.15 - index * 0.01})`,
            boxShadow: `0 0 ${15 - index}px rgba(147, 51, 234, ${0.3 - index * 0.02})`,
            filter: `blur(${index * 0.5}px)`, // Reduced blur for better performance
          }}
          initial={false}
          transition={{
            type: "tween",
            duration: 0.1,
          }}
        />
      ))}

      {/* Main cursor blob with improved performance */}
      <motion.div
        className="w-24 h-24 fixed rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />

      {/* Simplified echo effect */}
      <motion.div
        className="w-48 h-48 fixed rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: 0.5,
        }}
        animate={{ scale: [0.5, 0.7, 0.5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
