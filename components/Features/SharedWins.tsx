import React from 'react';
import { Win } from '../../types';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SharedWinsProps {
  wins: Win[];
  onAddWin: (text: string) => void;
}

const SharedWins: React.FC<SharedWinsProps> = ({ wins, onAddWin }) => {
    const [input, setInput] = React.useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if(input.trim()) {
            onAddWin(input);
            setInput('');
        }
    }

    return (
        <div className="p-6">
            <h3 className="text-xs font-bold text-zinc-500 mb-6 uppercase tracking-widest">Small Sparks</h3>
            
            <form onSubmit={handleAdd} className="mb-6 flex gap-2 relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="One tiny good thing..."
                    className="w-full bg-black/20 border border-white/5 rounded-full text-xs px-4 py-3 text-zinc-300 focus:border-emerald-500/30 focus:outline-none placeholder-zinc-700 transition-colors"
                    maxLength={40}
                />
                <button 
                    type="submit" 
                    disabled={!input} 
                    className="absolute right-1 top-1 bottom-1 text-zinc-500 hover:text-emerald-400 disabled:opacity-0 bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                >
                    <Check size={14} />
                </button>
            </form>

            <ul className="space-y-4">
                <AnimatePresence>
                    {wins.slice(0, 8).map((win) => (
                        <motion.li 
                            key={win.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 text-sm text-zinc-400 font-light"
                        >
                            <span className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                            {win.content}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
};

export default SharedWins;