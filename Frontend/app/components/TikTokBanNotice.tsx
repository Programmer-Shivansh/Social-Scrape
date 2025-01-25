'use client'
import { motion } from "framer-motion";
import { FaTiktok, FaTimes, FaBan } from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';

interface TikTokBanNoticeProps {
  onClose: () => void;
}

export default function TikTokBanNotice({ onClose }: TikTokBanNoticeProps) {
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
        {/* Background Card */}
        <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl p-8 backdrop-blur-lg border border-white/10 shadow-2xl">
          {/* TikTok Logo Animation */}
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
              <FaTiktok size={96} className="text-white/80" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-red-500"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FaBan size={96} className="opacity-80" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center justify-center gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HiOutlineEmojiSad size={32} className="text-white" />
              <h2 className="text-3xl font-bold text-white">Oops!</h2>
            </motion.div>
            
            <p className="text-white/90 text-lg">
              TikTok is currently banned in India
            </p>
            
            <motion.div 
              className="bg-white/10 rounded-xl p-4 mt-4"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-white/70">
                Try scraping content from other supported platforms like Instagram, YouTube, or Facebook instead.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -z-10 inset-0 opacity-50"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(225, 29, 72, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 70% 70%, rgba(79, 70, 229, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 30% 30%, rgba(225, 29, 72, 0.1) 0%, transparent 70%)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}
