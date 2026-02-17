import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
  noFloat?: boolean;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ children, delay = 0, className = "", onClick, noFloat = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95, rotateX: 5 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotateX: 0,
        // Breathing float animation
        translateY: noFloat ? 0 : [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay, ease: "easeOut" },
        y: { duration: 0.8, delay, ease: "easeOut" },
        scale: { duration: 0.8, delay, ease: "easeOut" },
        rotateX: { duration: 0.8, delay, ease: "easeOut" },
        translateY: { 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay: Math.random() * 2 // Randomize phase 
        }
      }}
      whileHover={{ 
        y: -5,
        scale: 1.01,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
        zIndex: 10,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(16px)"
      }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/[0.03] backdrop-blur-md 
        border border-white/10 
        rounded-2xl shadow-xl shadow-black/20
        transform-gpu
        transition-colors duration-500
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Glass Reflection Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-black/[0.1] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default FloatingCard;