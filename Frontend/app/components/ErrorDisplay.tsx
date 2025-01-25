'use client'
import { motion } from "framer-motion";
import { FaServer, FaGithub, FaTimes, FaCode } from 'react-icons/fa';

interface ErrorDisplayProps {
  onClose: () => void;
}

export default function ErrorDisplay({ onClose }: ErrorDisplayProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center overflow-y-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <motion.button
        className="fixed top-4 right-4 text-white/70 hover:text-white z-50"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
      >
        <FaTimes size={24} />
      </motion.button>

      <div className="max-w-2xl w-full flex flex-col gap-6 my-8">
        <motion.div 
          className="text-center space-y-3"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <FaCode className="text-purple-400 text-3xl mx-auto" />
          <h2 className="text-2xl font-bold text-white drop-shadow-xl">
            Server Not Running
          </h2>
          <p className="text-white/80 text-sm">
            Follow these steps to get started with the backend server
          </p>
        </motion.div>

        {/* Git Clone Instructions */}
        <motion.div 
          className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-xl p-4 backdrop-blur-lg border border-white/10 shadow-2xl"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <motion.div 
            className="text-lg text-white mb-3 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <FaGithub className="text-purple-400" />
            <h2>1. Clone the Repository</h2>
          </motion.div>

          <motion.div 
            className="font-mono text-sm"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(0, 0, 0, 0.4)"
            }}
          >
            <div className="bg-black/30 p-3 rounded-lg text-white/90 flex items-center gap-2 overflow-x-auto">
              <span className="text-purple-400 shrink-0">$</span>
              <span className="whitespace-nowrap">git clone https://github.com/Programmer-Shivansh/Social-Scrape</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Backend Setup Instructions */}
        <motion.div 
          className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-xl p-4 backdrop-blur-lg border border-white/10 shadow-2xl"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
        >
          <motion.div 
            className="text-lg text-white mb-3 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <FaServer className="text-purple-400" />
            <h2>2. Setup & Run Backend</h2>
          </motion.div>

          <motion.div 
            className="space-y-2 font-mono text-sm"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {[
              'cd Social-Scrape/Backend',
              'python -m venv venv',
              'source venv/bin/activate',
              'pip install -r requirements.txt',
              'python main.py'
            ].map((cmd, i) => (
              <motion.div
                key={i}
                className="bg-black/30 p-3 rounded-lg text-white/90 flex items-center gap-2 overflow-x-auto"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(0, 0, 0, 0.4)"
                }}
              >
                <span className="text-purple-400 shrink-0">$</span>
                <span className="whitespace-nowrap">{cmd}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none opacity-50"
        animate={{
          background: [
            "radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.3) 0%, transparent 70%)",
            "radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
            "radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.3) 0%, transparent 70%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
