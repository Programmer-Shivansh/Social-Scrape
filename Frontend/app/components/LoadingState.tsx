'use client'
import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Container with fixed size for proper centering */}
      <div className="relative flex items-center justify-center" style={{ width: '8rem', height: '8rem' }}>
        {/* All circles positioned absolutely relative to container center */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer circle */}
          <motion.div 
            className="absolute w-32 h-32 rounded-full border-4 border-purple-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle circle */}
          <motion.div 
            className="absolute w-24 h-24 rounded-full border-4 border-pink-500/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner circle */}
          <motion.div 
            className="absolute w-16 h-16 rounded-full border-4 border-indigo-500/30"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ 
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div 
              className="w-full h-full rounded-full border-4 border-t-white border-r-white/50 border-b-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Pulsing dots */}
        <div className="absolute -bottom-20 flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-white"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          className="absolute -bottom-32 text-white/70 text-center text-sm whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Extracting data...
        </motion.p>
      </div>

      {/* Background effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
}
