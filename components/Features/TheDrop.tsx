import React, { useState } from 'react';
import { Send, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkSafety } from '../../services/geminiService';
import { REFLECTIVE_RESPONSES, GENTLE_PROMPTS } from '../../constants';
import FloatingCard from '../UI/FloatingCard';

interface TheDropProps {
  onPost: (content: string) => void;
  isBlackbox?: boolean;
  isSlowMode?: boolean;
}

const TheDrop: React.FC<TheDropProps> = ({ onPost, isBlackbox = false, isSlowMode = false }) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'posted' | 'unsafe'>('idle');
  const [unsafeReason, setUnsafeReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [followUp, setFollowUp] = useState<string | null>(null);

  const MAX_CHARS = 500;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setStatus('analyzing');

    const extremeRegex = /(die|kill|bomb|murder)/i;
    if (extremeRegex.test(text)) {
        setStatus('unsafe');
        setUnsafeReason("We detected harsh words. Please pause.");
        return;
    }

    const safetyCheck = await checkSafety(text);
    
    if (!safetyCheck.safe) {
      setStatus('unsafe');
      setUnsafeReason(safetyCheck.reason || "This content feels a bit too heavy.");
      return;
    }

    const randomFeedback = REFLECTIVE_RESPONSES[Math.floor(Math.random() * REFLECTIVE_RESPONSES.length)];
    setFeedback(randomFeedback);
    
    if (Math.random() > 0.7) {
        setFollowUp(GENTLE_PROMPTS[Math.floor(Math.random() * GENTLE_PROMPTS.length)]);
    } else {
        setFollowUp(null);
    }

    if (isBlackbox) {
      setTimeout(() => {
        setText('');
        setStatus('posted');
      }, isSlowMode ? 1500 : 800);
    } else {
      onPost(text);
      setText('');
      setStatus('posted');
    }
    
    setTimeout(() => {
        setStatus('idle');
        setFollowUp(null);
    }, isSlowMode ? 7000 : 5000);
  };

  return (
    <FloatingCard 
      className={`w-full p-6 md:p-8 ${isBlackbox ? 'bg-black/40 border-stone-800' : ''}`}
      noFloat={isBlackbox}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-base font-bold ${isBlackbox ? 'text-stone-500' : 'text-stone-300'}`}>
          {isBlackbox ? 'The Void' : 'How are you holding up?'}
        </h2>
        <span className="text-xs text-stone-600 font-medium">
          {text.length}/{MAX_CHARS}
        </span>
      </div>

      <AnimatePresence mode='wait'>
        {status === 'posted' ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: isSlowMode ? 2 : 0.8 }}
            className="h-40 flex flex-col items-center justify-center text-center space-y-4"
          >
            <span className="text-stone-300 font-light text-lg md:text-xl tracking-wide">
                {feedback}
            </span>
            {followUp && (
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-stone-500 text-sm italic"
                >
                    {followUp}
                </motion.span>
            )}
            <button 
                onClick={() => setStatus('idle')}
                className="text-xs text-stone-600 hover:text-stone-400 transition-colors font-medium mt-2 uppercase tracking-widest"
            >
                Write more
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <textarea
              className={`w-full h-40 bg-transparent text-lg focus:outline-none resize-none placeholder-stone-700/50 font-light leading-relaxed ${isBlackbox ? 'text-stone-500' : 'text-stone-300'}`}
              placeholder={isBlackbox ? "Say whatever you need to say... it will vanish." : "It’s okay if it feels messy..."}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              disabled={status === 'analyzing'}
              spellCheck={false}
            />

            {status === 'unsafe' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="flex items-center gap-2 text-rose-300 text-xs mt-2 p-3 rounded-lg bg-rose-500/10"
              >
                <AlertCircle size={14} />
                {unsafeReason}
              </motion.div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={!text || status === 'analyzing'}
                className={`group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-stone-200 transition-all duration-500 text-xs font-bold uppercase tracking-wider ${!text ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              >
                {status === 'analyzing' ? (
                  <RefreshCw className="animate-spin w-4 h-4 text-stone-500" />
                ) : (
                    <>
                        {isBlackbox ? 'Let it vanish' : 'Let it be heard'}
                        <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
                    </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingCard>
  );
};

export default TheDrop;