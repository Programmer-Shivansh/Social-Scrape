'use client'
import { motion } from "framer-motion";
import { FaServer, FaKey, FaGithub, FaTimes } from 'react-icons/fa';

interface ErrorDisplayProps {
  onClose: () => void;
}

export default function ErrorDisplay({ onClose }: ErrorDisplayProps) {
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <motion.button
        className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
      >
        <FaTimes size={24} />
      </motion.button>

      <div className="max-w-4xl w-full flex flex-col gap-8">
        {/* Git Clone Instructions */}
        <motion.div 
          className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl p-6 backdrop-blur-lg border border-white/10 shadow-2xl"
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <motion.div 
            className="text-2xl text-white mb-4 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <FaGithub className="text-purple-400" />
            <h2>First, Clone the Repository</h2>
          </motion.div>

          <motion.div 
            className="font-mono text-sm"
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(0, 0, 0, 0.4)"
            }}
          >
            <div className="bg-black/30 p-3 rounded-lg text-white/90">
              $ git clone https://github.com/Programmer-Shivansh/Social-Scrape
            </div>
          </motion.div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Backend Setup Instructions */}
          <motion.div 
            className="flex-1 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl p-6 backdrop-blur-lg border border-white/10 shadow-2xl"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.div 
              className="text-3xl text-white mb-6 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <FaServer className="text-purple-400" />
              <h2>Backend Setup</h2>
            </motion.div>

            <motion.div 
              className="space-y-4 font-mono text-sm"
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
                'python -m venv venv',
                'source venv/bin/activate',
                'pip install -r requirements.txt',
                'python main.py'
              ].map((cmd, i) => (
                <motion.div
                  key={i}
                  className="bg-black/30 p-3 rounded-lg text-white/90"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(0, 0, 0, 0.4)"
                  }}
                >
                  $ {cmd}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Environment Variables Setup */}
          <motion.div 
            className="flex-1 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-2xl p-6 backdrop-blur-lg border border-white/10 shadow-2xl"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="text-3xl text-white mb-6 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <FaKey className="text-indigo-400" />
              <h2>Environment Setup</h2>
            </motion.div>

            <motion.pre 
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
                'INSTAGRAM_USERNAME=your_username',
                'INSTAGRAM_PASSWORD=your_password',
                'FACEBOOK_EMAIL=your_facebook_email',
                'FACEBOOK_PASSWORD=your_facebook_password'
              ].map((env, i) => (
                <motion.div
                  key={i}
                  className="bg-black/30 p-3 rounded-lg text-white/90"
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(0, 0, 0, 0.4)"
                  }}
                >
                  {env}
                </motion.div>
              ))}
            </motion.pre>
          </motion.div>
        </div>
      </div>

      {/* Background animation */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.1) 0%, transparent 70%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
