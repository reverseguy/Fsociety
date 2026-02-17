import React, { useState } from 'react';
import { Post, Identity } from '../../types';
import { REPLY_STARTERS } from '../../constants';
import { Heart, Activity, User, EyeOff, Link as LinkIcon, X, Send, Edit2, Check, MessageCircle, ShieldAlert, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCard from '../UI/FloatingCard';

interface EchoButtonProps {
    icon: React.ReactNode;
    label: string;
    count: number;
    onClick: () => void;
}

const EchoButton: React.FC<EchoButtonProps> = ({ icon, label, count, onClick }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="flex items-center gap-1.5 hover:text-violet-300 transition-colors group/btn"
        title={label}
    >
        <span className="group-hover/btn:scale-110 transition-transform duration-300">{icon}</span>
        <span className="text-xs font-medium">{count > 0 ? count : ''}</span>
    </button>
);

interface TheWallProps {
  posts: Post[];
  isSilenceMode: boolean;
  onEcho: (postId: string, type: 'feel' | 'chaos' | 'alone') => void;
  onToggleSilence: () => void;
  onPost: (content: string) => void;
  onReply: (postId: string, content: string) => void;
  onUpdatePost: (postId: string, newContent: string) => void;
  isSlowMode?: boolean;
  identity: Identity | null;
  savedPostIds: string[];
  onToggleSave: (postId: string) => void;
}

const TheWall: React.FC<TheWallProps> = ({ 
    posts, 
    isSilenceMode, 
    onEcho, 
    onToggleSilence, 
    onPost, 
    onReply, 
    onUpdatePost, 
    isSlowMode = false, 
    identity,
    savedPostIds,
    onToggleSave
}) => {
  const [transitionStage, setTransitionStage] = useState<'idle' | 'breathing' | 'choices'>('idle');
  const [echoModalOpen, setEchoModalOpen] = useState(false);
  const [echoText, setEchoText] = useState('');
  
  const [viewSavedOnly, setViewSavedOnly] = useState(false);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyWarning, setReplyWarning] = useState<string | null>(null);
  const [successReplyId, setSuccessReplyId] = useState<string | null>(null);

  const MAX_CHAR_LIMIT = 200;

  const handleSilenceClick = () => {
    if (!isSilenceMode) {
      onToggleSilence(); 
      setTransitionStage('breathing');
      setTimeout(() => {
        setTransitionStage('choices');
      }, isSlowMode ? 6000 : 4000);
    } else {
      onToggleSilence();
      setTransitionStage('idle');
    }
  };

  const openEchoModal = () => {
    setEchoModalOpen(true);
  };

  const closeEchoModal = () => {
    setEchoModalOpen(false);
    setEchoText('');
  };

  const submitEcho = () => {
    if (echoText.trim()) {
        onPost(echoText);
        closeEchoModal();
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingId(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
        onUpdatePost(editingId, editContent);
        setEditingId(null);
        setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const toggleExpandPost = (postId: string) => {
    setExpandedPostIds(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleReply = (postId: string) => {
    if (replyingToId === postId) {
      setReplyingToId(null);
      setReplyContent('');
      setReplyWarning(null);
    } else {
      setReplyingToId(postId);
      setReplyContent('');
      setReplyWarning(null);
    }
  };

  const checkReplySafety = (text: string): boolean => {
    const harshWords = /(stupid|idiot|fake|ugly|lie|liar|dumb|hate|kill|die|shut up|wrong|bad)/i;
    if (harshWords.test(text)) {
      setReplyWarning("Could you say this in a gentler way?");
      return false;
    }
    setReplyWarning(null);
    return true;
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 150);
    setReplyContent(val);
    if (replyWarning) setReplyWarning(null);
  };

  const submitReply = (postId: string) => {
    if (!replyContent.trim()) return;
    if (!checkReplySafety(replyContent)) return;

    onReply(postId, replyContent);
    setReplyingToId(null);
    setReplyContent('');
    
    setSuccessReplyId(postId);
    setTimeout(() => setSuccessReplyId(null), 4000);
  };

  const displayedPosts = viewSavedOnly 
    ? posts.filter(p => savedPostIds.includes(p.id))
    : posts;

  if (isSilenceMode) {
    return (
      <FloatingCard className="w-full h-[600px] flex flex-col items-center justify-center relative transition-all duration-1000">
        <AnimatePresence mode='wait'>
          {transitionStage === 'breathing' && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isSlowMode ? 2 : 1 }}
              className="text-center px-6"
            >
              <div className="w-24 h-24 rounded-full bg-white/5 blur-2xl animate-pulse mx-auto mb-6"></div>
              <p className="text-zinc-400 font-medium text-lg tracking-wide">
                Breathing...
              </p>
            </motion.div>
          )}

          {transitionStage === 'choices' && (
             <motion.div
                key="choices"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: isSlowMode ? 2 : 1 }}
                className="text-center space-y-8"
             >
                <p className="text-zinc-500 font-medium">The noise has been paused.</p>
                <div className="flex gap-6 justify-center">
                    <button 
                        onClick={() => handleSilenceClick()} 
                        className="text-sm text-zinc-400 hover:text-white font-bold transition-all"
                    >
                        Resume
                    </button>
                    <span className="text-zinc-700">or</span>
                    <button 
                        className="text-sm text-emerald-600 hover:text-emerald-500 cursor-default font-medium"
                    >
                        Keep Resting
                    </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </FloatingCard>
    );
  }

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-end mb-6 px-2">
        <div className="flex items-center gap-4">
            <h3 className={`text-sm font-bold transition-colors cursor-pointer ${!viewSavedOnly ? 'text-zinc-300' : 'text-zinc-600 hover:text-zinc-400'}`} onClick={() => setViewSavedOnly(false)}>
                Others are sharing
            </h3>
            <div className="h-4 w-[1px] bg-zinc-700"></div>
            <button 
                onClick={() => setViewSavedOnly(!viewSavedOnly)}
                className={`text-sm font-bold flex items-center gap-2 transition-colors ${viewSavedOnly ? 'text-amber-200/90' : 'text-zinc-600 hover:text-amber-500/50'}`}
            >
                <Bookmark size={14} fill={viewSavedOnly ? "currentColor" : "none"} />
                Saved
            </button>
        </div>

        <button 
          onClick={handleSilenceClick}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5"
        >
          <EyeOff size={12} />
          Let’s slow down
        </button>
      </div>

      <div className="space-y-6 min-h-[300px]">
        {displayedPosts.length === 0 && viewSavedOnly && (
             <div className="flex flex-col items-center justify-center h-48 text-zinc-600 space-y-2 opacity-60">
                <Bookmark size={24} strokeWidth={1.5} />
                <p className="text-sm">You haven't kept anything close yet.</p>
             </div>
        )}

        <AnimatePresence initial={false}>
          {displayedPosts.map((post, index) => {
            const isEditing = editingId === post.id;
            const isReplying = replyingToId === post.id;
            const isSaved = savedPostIds.includes(post.id);
            const replies = post.replies || [];
            const isAuthor = identity && post.authorId === identity.id;
            
            const isLong = post.content.length > MAX_CHAR_LIMIT;
            const isExpanded = expandedPostIds.includes(post.id);
            const displayContent = !isLong || isExpanded ? post.content : post.content.slice(0, MAX_CHAR_LIMIT) + '...';

            return (
                <FloatingCard
                    key={post.id}
                    delay={index * 0.1}
                    className="p-6 md:p-8"
                >
                
                {isEditing ? (
                  <div className="mb-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-black/20 text-zinc-200 text-base p-4 rounded-xl focus:outline-none resize-none h-auto min-h-[100px]"
                      autoFocus
                    />
                    <div className="flex gap-3 mt-2 justify-end">
                      <button onClick={handleCancelEdit} className="text-xs font-bold text-zinc-500 hover:text-zinc-400 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5">
                        <X size={12}/> Cancel
                      </button>
                      <button onClick={handleSaveEdit} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-900/20">
                        <Check size={12}/> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-lg text-zinc-200 leading-relaxed font-light whitespace-pre-wrap tracking-wide">
                      {displayContent}
                      {isLong && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandPost(post.id);
                          }}
                          className="ml-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors inline-block"
                        >
                           {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>
                    {post.authorName && (
                        <div className="flex items-center gap-2 mt-3 opacity-40">
                            <div className="h-[1px] w-4 bg-zinc-600"></div>
                            <p className="text-[10px] text-zinc-400 italic">
                                {post.authorName}
                            </p>
                        </div>
                    )}
                  </div>
                )}
                
                {/* ACTION BAR */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
                        <EchoButton 
                            icon={<Heart size={16} />} 
                            label="I feel this too" 
                            count={post.echoes.feel} 
                            onClick={() => onEcho(post.id, 'feel')} 
                        />
                        <EchoButton 
                            icon={<Activity size={16} />} 
                            label="Hugs" 
                            count={post.echoes.chaos} 
                            onClick={() => onEcho(post.id, 'chaos')} 
                        />
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleReply(post.id); }}
                        className={`flex items-center gap-2 text-xs font-medium transition-colors opacity-70 hover:opacity-100 ${isReplying ? 'text-violet-300' : 'text-zinc-500 hover:text-violet-300'}`}
                    >
                         <MessageCircle size={16} />
                         <span>Respond</span>
                    </button>
                    
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSave(post.id); }}
                        className={`flex items-center gap-2 text-xs font-medium transition-colors opacity-70 hover:opacity-100 ${isSaved ? 'text-amber-200/80' : 'text-zinc-500 hover:text-amber-200/50'}`}
                        title="Keep this close"
                    >
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    </button>

                    {isAuthor && !isEditing && (
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(post); }} className="text-zinc-600 hover:text-zinc-400 opacity-50 hover:opacity-100 ml-auto">
                            <Edit2 size={12} />
                        </button>
                    )}
                </div>

                {/* REPLY SECTION */}
                <AnimatePresence>
                    {isReplying && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-4"
                        >
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {REPLY_STARTERS.map(starter => (
                                        <button 
                                            key={starter}
                                            onClick={() => setReplyContent(starter + " ")}
                                            className="text-[10px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                                        >
                                            {starter}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    autoFocus
                                    value={replyContent}
                                    onChange={handleReplyChange}
                                    placeholder="Speak gently..."
                                    className="w-full h-20 bg-transparent text-sm text-zinc-300 focus:outline-none resize-none mb-2 placeholder-zinc-700"
                                    maxLength={150}
                                />
                                
                                <div className="flex justify-between items-center">
                                     {replyWarning ? (
                                         <span className="text-[10px] text-rose-400 flex items-center gap-1 animate-pulse">
                                            <ShieldAlert size={10} /> {replyWarning}
                                         </span>
                                     ) : (
                                        <span className="text-[10px] text-zinc-600">No advice. Just presence.</span>
                                     )}
                                    <button 
                                        onClick={() => submitReply(post.id)}
                                        disabled={!replyContent.trim()}
                                        className="bg-white/10 hover:bg-white/20 text-stone-200 disabled:opacity-30 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* REPLIES LIST */}
                <div className="space-y-3 mt-4">
                    {/* Success Message */}
                    <AnimatePresence>
                        {successReplyId === post.id && (
                             <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-xs text-emerald-400/80 italic flex items-center gap-2 pl-2"
                             >
                                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                 A soft line connects you now.
                             </motion.div>
                        )}
                    </AnimatePresence>

                    {replies.length > 0 && (
                        <div className="relative pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-[1px] before:bg-gradient-to-b before:from-white/10 before:to-transparent">
                            {replies.slice(-3).map((reply, i) => (
                                <motion.div 
                                    key={reply.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="mb-3 last:mb-0 relative"
                                >
                                    {/* Connection curve */}
                                    <div className="absolute -left-6 top-3 w-4 h-[1px] bg-white/10"></div>
                                    
                                    <p className="text-sm text-zinc-400 font-light">{reply.content}</p>
                                    <div className="text-[9px] text-zinc-600 mt-1 opacity-50 flex justify-end gap-1">
                                        {reply.authorName && <span>— {reply.authorName}</span>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                </FloatingCard>
            );
          })}
        </AnimatePresence>
        
        <div className="py-12 text-center">
            <p className="text-xs text-zinc-600 font-medium tracking-widest opacity-50">THE END OF THOUGHTS</p>
        </div>
      </div>

      <AnimatePresence>
        {echoModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
                <FloatingCard className="w-full max-w-lg p-8 bg-[#101010]" noFloat>
                    <button onClick={closeEchoModal} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300">
                        <X size={16} />
                    </button>
                    
                    <h3 className="text-sm font-bold text-zinc-400 mb-4">Connecting Thought</h3>
                    <textarea
                        autoFocus
                        value={echoText}
                        onChange={(e) => setEchoText(e.target.value.slice(0, 200))}
                        placeholder="This made me think of..."
                        className="w-full h-32 bg-black/30 border border-white/5 text-zinc-300 p-4 rounded-xl text-sm focus:outline-none resize-none mb-4"
                    />
                    
                    <div className="flex justify-end">
                        <button 
                            onClick={submitEcho}
                            disabled={!echoText.trim()}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-zinc-300 px-6 py-2 rounded-full text-xs font-bold transition-colors disabled:opacity-50"
                        >
                            Release <Send size={12} />
                        </button>
                    </div>
                </FloatingCard>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TheWall;