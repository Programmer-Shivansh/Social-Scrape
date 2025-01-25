'use client'
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from 'react-icons/fa';

interface ResponseDisplayProps {
  data: any;
  onClose: () => void;
}

export default function ResponseDisplay({ data, onClose }: ResponseDisplayProps) {
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl p-6 max-w-2xl w-full backdrop-blur-lg border border-white/10 shadow-2xl"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Scraped Data</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <FaTimes size={24} />
            </motion.button>
          </div>

          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {Object.entries(data.data).map(([key, value]: [string, any], index) => (
              <motion.div
                key={key}
                className="bg-white/10 rounded-lg p-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.15)"
                }}
              >
                <h3 className="text-white/70 text-sm mb-1">{key}</h3>
                <div className="text-white">
                  {typeof value === 'object' ? (
                    <pre className="overflow-auto text-sm">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    String(value)
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
