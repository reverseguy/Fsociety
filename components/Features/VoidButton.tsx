import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoidButtonProps {
    isSlowMode?: boolean;
}

const VoidButton: React.FC<VoidButtonProps> = ({ isSlowMode = false }) => {
  const [active, setActive] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (active) {
      const slowMultiplier = isSlowMode ? 1.5 : 1;
      
      const t1 = setTimeout(() => setStage(1), 2000 * slowMultiplier);
      const t2 = setTimeout(() => {
        setActive(false);
        setStage(0);
      }, 12000 * slowMultiplier);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [active, isSlowMode]);

  return (
    <>
      <button 
        onClick={() => setActive(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#292524] text-stone-400 px-6 py-3 text-xs font-bold rounded-full hover:bg-stone-800 hover:text-stone-200 transition-all opacity-90 hover:opacity-100 shadow-lg border border-white/5"
      >
        Just sit with me
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className="fixed inset-0 z-[100] bg-[#1c1917] flex items-center justify-center cursor-none"
          >
            {stage >= 1 && (
               <motion.span 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               transition={{ duration: 2.5 }}
               className="text-stone-400 font-medium text-lg md:text-xl text-center px-4 leading-loose tracking-wide"
             >
               You don't have to say anything.<br/>
               <span className="text-sm text-stone-600 mt-4 block">We'll just be here.</span>
             </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoidButton;