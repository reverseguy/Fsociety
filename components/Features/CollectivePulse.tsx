import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CollectivePulse: React.FC = () => {
  const [hasPulsed, setHasPulsed] = useState(false);
  const [count, setCount] = useState(428);

  const handlePulse = () => {
    if (!hasPulsed) {
      setHasPulsed(true);
      setCount(c => c + 1);
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full scale-50 opacity-20 animate-pulse pointer-events-none"></div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest z-10">
        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse"></span>
        Presence
      </div>
      
      {!hasPulsed ? (
        <div className="z-10 flex flex-col items-center gap-4">
            <p className="text-xs text-zinc-500 font-medium">Tap if you're holding on.</p>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePulse}
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-rose-500/20 transition-all border border-white/5 hover:border-rose-500/30"
            >
                <Heart size={20} className="text-zinc-600 group-hover:text-rose-400 transition-colors" />
            </motion.button>
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
        >
            <span className="text-4xl font-light text-zinc-200 tracking-tighter block">{count}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest opacity-60">Souls here</span>
        </motion.div>
      )}
    </div>
  );
};

export default CollectivePulse;