import React, { useState, useEffect } from 'react';
import { AppState, NoiseLevel, Post, Win, MoodStats, Identity } from './types';
import { INITIAL_WALL_POSTS, INITIAL_WINS, INITIAL_MOODS, GENTLE_LINES, ID_ADJECTIVES, ID_NOUNS } from './constants';
import { getChaosMessage } from './services/geminiService';
import TheDrop from './components/Features/TheDrop';
import TheWall from './components/Features/TheWall';
import StateOfMind from './components/Features/StateOfMind';
import SharedWins from './components/Features/SharedWins';
import VoidButton from './components/Features/VoidButton';
import CollectivePulse from './components/Features/CollectivePulse';
import Manifesto from './components/Features/Manifesto';
import SpaceBackground from './components/UI/SpaceBackground';
import FloatingCard from './components/UI/FloatingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, HeartHandshake, Wind, Fingerprint } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [appState, setAppState] = useState<AppState>({
    hasEntered: false,
    noiseLevel: 'quiet',
    view: 'dashboard',
    nightMode: false,
    chaosCredits: 5,
  });

  const [identity, setIdentity] = useState<Identity | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_WALL_POSTS);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [wins, setWins] = useState<Win[]>(INITIAL_WINS);
  const [moods, setMoods] = useState<MoodStats>(INITIAL_MOODS);
  const [isSilenceMode, setIsSilenceMode] = useState(false);
  const [chaosMessage, setChaosMessage] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [firstVisitMsg, setFirstVisitMsg] = useState(false);

  // --- IDENTITY LOGIC ---
  useEffect(() => {
    const generateIdentity = (): Identity => {
      const adj = ID_ADJECTIVES[Math.floor(Math.random() * ID_ADJECTIVES.length)];
      const noun = ID_NOUNS[Math.floor(Math.random() * ID_NOUNS.length)];
      return {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: `${adj}${noun}`,
        joinedAt: Date.now()
      };
    };

    const storedId = localStorage.getItem('fsociety_identity_v2');
    if (storedId) {
      setIdentity(JSON.parse(storedId));
    } else {
      const newId = generateIdentity();
      localStorage.setItem('fsociety_identity_v2', JSON.stringify(newId));
      setIdentity(newId);
    }
  }, []);

  // --- SAVED POSTS LOGIC ---
  useEffect(() => {
    const storedSaved = localStorage.getItem('fsociety_saved_posts_v1');
    if (storedSaved) {
      try {
        setSavedPostIds(JSON.parse(storedSaved));
      } catch (e) {
        console.error("Failed to parse saved posts");
      }
    }
  }, []);

  const handleToggleSave = (postId: string) => {
    setSavedPostIds(prev => {
      const newIds = prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      
      localStorage.setItem('fsociety_saved_posts_v1', JSON.stringify(newIds));
      return newIds;
    });
  };

  // --- EFFECTS ---
  useEffect(() => {
    const visited = localStorage.getItem('fsociety_visited_v1');
    if (!visited) {
      setFirstVisitMsg(true);
      localStorage.setItem('fsociety_visited_v1', 'true');
    }
  }, []);
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      setAppState(prev => ({ ...prev, nightMode: true }));
    }
  }, []);

  useEffect(() => {
    if (!appState.hasEntered) return;
    const interval = setInterval(() => {
        if (!chaosMessage && Math.random() > 0.7) {
            const line = GENTLE_LINES[Math.floor(Math.random() * GENTLE_LINES.length)];
            setChaosMessage(line);
            setTimeout(() => setChaosMessage(null), 8000); 
        }
    }, 45000);
    return () => clearInterval(interval);
  }, [appState.hasEntered, chaosMessage]);

  // --- HANDLERS ---
  const handleEntry = (level: NoiseLevel) => {
    if (firstVisitMsg) {
       setTimeout(() => setFirstVisitMsg(false), 5000);
    }
    setAppState(prev => ({ ...prev, hasEntered: true, noiseLevel: level }));
    
    setTimeout(() => {
        setChaosMessage(`Welcome, ${identity?.name || 'friend'}.`);
        setTimeout(() => setChaosMessage(null), 6000);
    }, 2000);
  };

  const handlePost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString() + Math.random().toString(),
      content,
      timestamp: Date.now(),
      authorName: identity?.name || 'Someone',
      authorId: identity?.id,
      echoes: { feel: 0, chaos: 0, alone: 0 },
      replies: []
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const handleReply = (postId: string, content: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, {
            id: Date.now().toString(),
            content,
            authorName: identity?.name || 'Someone',
            authorId: identity?.id,
            timestamp: Date.now()
          }]
        };
      }
      return post;
    }));
  };

  const handleUpdatePost = (postId: string, newContent: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, content: newContent } : p
    ));
  };

  const handleEcho = (postId: string, type: 'feel' | 'chaos' | 'alone') => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, echoes: { ...p.echoes, [type]: p.echoes[type] + 1 } };
      }
      return p;
    }));
  };

  const handleAddWin = (content: string) => {
    setWins(prev => [{ id: Date.now().toString(), content }, ...prev]);
  };

  const requestMessage = async (type: 'chaos' | 'relief') => {
    if (appState.chaosCredits > 0) {
      setAppState(prev => ({ ...prev, chaosCredits: prev.chaosCredits - 1 }));
      const msg = await getChaosMessage(type);
      setChaosMessage(msg);
      setTimeout(() => setChaosMessage(null), 8000); 
    }
  };

  const performExit = () => {
      setShowExitConfirm(false);
      document.body.innerHTML = `
        <div style="height: 100vh; width: 100vw; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #a8a29e; font-family: 'Quicksand', sans-serif; text-align: center; padding: 20px; transition: opacity 2s ease;">
            <p style="margin-bottom: 24px; font-size: 16px; font-weight: 500;">Drift safely.</p>
        </div>
      `;
      setTimeout(() => {
          try { window.close(); } catch(e){} 
          window.location.href = "about:blank";
      }, 3000);
  };

  // --- ENTRY VIEW ---
  if (!appState.hasEntered) {
    return (
      <div className="min-h-screen relative overflow-hidden font-sans flex items-center justify-center">
        <SpaceBackground />
        
        <motion.div 
          className="z-10 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Main Pulsing Orb */}
          <motion.div 
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-violet-500/10 to-blue-500/10 backdrop-blur-3xl mb-12 flex items-center justify-center relative group"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
             <div className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors duration-1000"></div>
             <div className="text-3xl md:text-5xl font-bold tracking-tighter text-stone-200/80">fsociety</div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-stone-400 font-light text-lg md:text-xl mb-12 tracking-wide"
          >
            Where do you want to rest right now?
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
                { id: 'quiet', label: 'Quiet', color: 'hover:border-emerald-500/30' },
                { id: 'loud', label: 'Heavy', color: 'hover:border-stone-500/30' },
                { id: 'screaming', label: 'Overwhelmed', color: 'hover:border-rose-500/30' },
                { id: 'numb', label: 'Empty', color: 'hover:border-blue-500/30' }
             ].map((level, i) => (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                  onClick={() => handleEntry(level.id as NoiseLevel)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center justify-center text-sm font-medium text-stone-400 transition-colors duration-500 ${level.color}`}
                >
                  {level.label}
                </motion.button>
             ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen text-stone-400 font-sans relative overflow-x-hidden selection:bg-violet-500/30">
      <SpaceBackground />
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#050505] to-transparent pt-6 pb-12 px-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
            <span 
              onClick={() => setAppState(prev => ({...prev, view: 'dashboard'}))}
              className="text-stone-200/80 font-bold tracking-tight text-xl cursor-pointer hover:text-white transition-colors"
            >
              fsociety
            </span>
            <button 
                onClick={() => setIsSlowMode(!isSlowMode)}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all border border-transparent ${isSlowMode ? 'bg-white/10 text-stone-200 border-white/10' : 'text-stone-500 hover:text-stone-300'}`}
            >
                <Wind size={14} />
                <span className="hidden sm:inline">{isSlowMode ? 'Slow Mode' : 'Slow Down'}</span>
            </button>
        </div>
        <div className="pointer-events-auto flex items-center gap-3">
             <div className="flex gap-2">
                <button 
                  onClick={() => setAppState(prev => ({...prev, view: prev.view === 'manifesto' ? 'dashboard' : 'manifesto'}))}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-500 backdrop-blur-md border ${appState.view === 'manifesto' ? 'bg-white/10 text-stone-200 border-white/20' : 'bg-white/5 border-white/5 text-stone-500 hover:text-stone-200'}`}
                >
                  Why?
                </button>
             </div>
             
             <button 
                onClick={() => setShowExitConfirm(true)} 
                className="text-stone-500 hover:text-stone-300 transition-colors ml-2 p-2 rounded-full hover:bg-white/5" 
                title="Leave"
             >
                 <LogOut size={16} />
             </button>
        </div>
      </header>

      {/* MESSAGE TOAST */}
      <AnimatePresence>
        {chaosMessage && (
            <motion.div 
                initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 1.5 }}
                className="fixed top-24 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
            >
                <div className="bg-black/40 border border-white/10 px-8 py-4 text-stone-200 text-sm font-medium backdrop-blur-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    {chaosMessage}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* EXIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showExitConfirm && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <FloatingCard className="max-w-sm w-full p-8 text-center bg-black/80" noFloat>
                    <div className="flex justify-center mb-6 text-stone-400/60">
                        <HeartHandshake size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-stone-200 font-bold text-lg mb-3">Heading out?</h3>
                    <p className="text-stone-500 text-sm mb-8 leading-relaxed font-medium">
                        It's okay to go.<br/>
                        The quiet will be here when you return.
                    </p>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={performExit}
                            className="w-full bg-stone-800/50 hover:bg-stone-700 text-stone-300 py-3 rounded-xl text-sm font-semibold transition-all duration-500"
                        >
                            Disconnect
                        </button>
                        <button 
                            onClick={() => setShowExitConfirm(false)}
                            className="w-full text-stone-500 hover:text-stone-300 py-3 text-sm font-medium transition-all duration-500"
                        >
                            Stay
                        </button>
                    </div>
                </FloatingCard>
            </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEW */}
      <div className="scene-container min-h-screen pt-24 pb-20 px-4 md:px-8">
        {appState.view === 'manifesto' ? (
          <Manifesto onBack={() => setAppState(prev => ({...prev, view: 'dashboard'}))} />
        ) : (
          <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            
            {/* LEFT COLUMN: The Wall */}
            <div className="lg:col-span-7 space-y-12">
                <section>
                    <TheDrop onPost={handlePost} isSlowMode={isSlowMode} />
                </section>
                
                <section>
                    <TheWall 
                        posts={posts} 
                        isSilenceMode={isSilenceMode} 
                        onEcho={handleEcho}
                        onToggleSilence={() => setIsSilenceMode(!isSilenceMode)}
                        onPost={handlePost}
                        onReply={handleReply}
                        onUpdatePost={handleUpdatePost}
                        isSlowMode={isSlowMode}
                        identity={identity}
                        savedPostIds={savedPostIds}
                        onToggleSave={handleToggleSave}
                    />
                </section>
            </div>

            {/* RIGHT COLUMN: Floating Modules */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24 h-fit">
                <FloatingCard delay={0.2} className="p-0">
                   <CollectivePulse />
                </FloatingCard>

                <FloatingCard delay={0.3} className="p-0">
                    <StateOfMind data={moods} />
                </FloatingCard>
                
                <FloatingCard delay={0.4} className="p-0">
                    <SharedWins wins={wins} onAddWin={handleAddWin} />
                </FloatingCard>
                
                <div className="mt-8 opacity-60 hover:opacity-90 transition-opacity duration-1000">
                    <TheDrop onPost={() => {}} isBlackbox={true} isSlowMode={isSlowMode} />
                </div>
            </div>
          </main>
        )}
      </div>

      <footer className="fixed bottom-4 left-6 z-30 flex items-center gap-3 text-[10px] text-stone-600 font-medium pointer-events-none">
         {identity && (
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                <Fingerprint size={12} className="opacity-50" />
                <span><span className="text-stone-400">{identity.name}</span></span>
            </div>
         )}
      </footer>

      <VoidButton isSlowMode={isSlowMode} />
    </div>
  );
};

export default App;