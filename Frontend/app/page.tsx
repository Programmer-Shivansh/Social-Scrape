'use client'
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { FaInstagram, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';
import MouseFollower from './components/MouseFollower';
import { scrapeUrl } from './services/api';
import LoadingState from './components/LoadingState';
import ResponseDisplay from './components/ResponseDisplay';
import ErrorDisplay from './components/ErrorDisplay';

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [showError, setShowError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const data = await scrapeUrl(url);
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Add floating animation for background objects
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Add mouse tracking for corner elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Update window dimensions
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial size
    updateWindowSize();
    
    // Add event listener
    window.addEventListener('resize', updateWindowSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Corner decoration components
  const CornerDecoration = ({ position }: { position: 'top-left' | 'top-right' }) => {
    const x = useTransform(mouseX, [0, window.innerWidth || 1], [0, 100]);
    const y = useTransform(mouseY, [0, window.innerHeight || 1], [0, 100]);

    return (
      <motion.div
        className={`absolute ${position === 'top-left' ? 'left-0' : 'right-0'} top-0 w-64 h-64 pointer-events-none`}
        style={{
          perspective: 1000
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${position === 'top-left' ? 'left-0' : 'right-0'} top-0 w-32 h-32 
              ${position === 'top-left' ? 'origin-top-left' : 'origin-top-right'}`}
            style={{
              rotateX: useTransform(y, [0, 100], [0, 30]),
              rotateY: useTransform(x, [0, 100], position === 'top-left' ? [-30, 0] : [0, 30]),
              translateZ: 100 * (i + 1)
            }}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 
                backdrop-blur-lg rounded-2xl border border-white/20`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 0.8 - i * 0.2,
                rotate: i * 5
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Add MouseFollower at the top level */}
      <MouseFollower />
      
      {/* Add corner decorations */}
      <CornerDecoration position="top-left" />
      <CornerDecoration position="top-right" />

      {/* Animated background objects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-lg"
          style={{
            width: Math.random() * 200 + 50,
            height: Math.random() * 200 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 0
          }}
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          custom={i}
        />
      ))}

      {/* Add glowing orbs in corners */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full filter blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 bg-purple-500/30 rounded-full filter blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        <motion.div 
          className="container mx-auto px-4 py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-7xl font-bold text-white text-center mb-8 drop-shadow-2xl"
            variants={itemVariants}
          >
            Multi-Scraper
          </motion.h1>
          
          <motion.p 
            className="text-2xl text-white text-center mb-12 drop-shadow-xl"
            variants={itemVariants}
          >
            Extract data from your favorite social platforms instantly
          </motion.p>

          <motion.form 
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto relative"
            variants={itemVariants}
          >
            <div className="relative flex items-center">
              <motion.input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your social media URL here..."
                className="w-full px-8 py-6 pr-40 rounded-2xl text-lg bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white placeholder-white/70 outline-none focus:border-white/40 transition-all duration-300 shadow-xl"
                whileFocus={{ scale: 1.02 }}
              />
              
              <motion.button
                type="submit"
                className="absolute right-3 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold shadow-lg backdrop-blur-sm hover:bg-opacity-90"
                whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
                whileTap={{ scale: 0.95 }}
              >
                Extract Data
              </motion.button>
            </div>
          </motion.form>

          <motion.div 
            className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
            variants={containerVariants}
          >
            {[
              { name: 'Instagram', icon: <FaInstagram size={40} />, color: 'from-pink-500 to-purple-500' },
              { name: 'YouTube', icon: <FaYoutube size={40} />, color: 'from-red-500 to-red-600' },
              { name: 'Twitter', icon: <FaTwitter size={40} />, color: 'from-blue-400 to-blue-500' },
              { name: 'TikTok', icon: <FaTiktok size={40} />, color: 'from-black to-gray-800' }
            ].map((platform) => (
              <motion.div
                key={platform.name}
                className={`bg-gradient-to-br ${platform.color} backdrop-blur-md rounded-2xl p-8 text-white text-center transform transition-all duration-300 shadow-xl hover:shadow-2xl`}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="mb-4"
                  whileHover={{ 
                    rotate: 360,
                    transition: { 
                      duration: 0.3,
                      ease: "linear"
                    }
                  }}
                >
                  {platform.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{platform.name}</h3>
                <p className="text-white/90 text-sm">
                  Extract profiles, posts, and analytics from {platform.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {isLoading && <LoadingState />}
      
      {response && (
        <ResponseDisplay 
          data={response} 
          onClose={() => setResponse(null)}
        />
      )}
      {showError && <ErrorDisplay onClose={handleCloseError} />}
    </div>
  );
}
