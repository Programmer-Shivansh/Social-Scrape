'use client'
import { motion } from "framer-motion";
import { FaTimes, FaFacebook, FaTools, FaInstagram, FaYoutube } from 'react-icons/fa';

interface FacebookMaintenanceNoticeProps {
  onClose: () => void;
}

export default function FacebookMaintenanceNotice({ onClose }: FacebookMaintenanceNoticeProps) {
  const platformIcons = [
    { Icon: FaInstagram, color: 'text-pink-500' },
    { Icon: FaYoutube, color: 'text-red-500' },
  ];

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        className="absolute top-4 right-4 text-white/70 hover:text-white"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
      >
        <FaTimes size={24} />
      </motion.button>

      <motion.div 
        className="max-w-md w-full relative"
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <div className="bg-gradient-to-br from-blue-900/90 to-indigo-900/90 rounded-2xl p-8 backdrop-blur-lg border border-white/10 shadow-2xl">
          {/* Maintenance Animation */}
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 relative"
            animate={{ rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaFacebook size={96} className="text-blue-500/80" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-yellow-500"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FaTools size={48} className="opacity-80" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">Under Maintenance</h2>
            <p className="text-white/90 text-lg mb-4">
              Facebook scraping is currently under maintenance
            </p>
            
            <motion.div 
              className="bg-white/10 rounded-xl p-4 mt-4"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-white/70 mb-4">
                Meanwhile, try scraping content from other supported platforms:
              </p>
              <div className="flex justify-center gap-6">
                {platformIcons.map(({ Icon, color }, index) => (
                  <motion.div
                    key={index}
                    className={`${color} cursor-pointer`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={32} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background effect */}
        <motion.div
          className="absolute -z-10 inset-0 opacity-50"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}
