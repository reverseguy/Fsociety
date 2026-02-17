export type NoiseLevel = 'quiet' | 'loud' | 'screaming' | 'numb';

export interface Identity {
  id: string;
  name: string;
  joinedAt: number;
}

export interface AppState {
  hasEntered: boolean;
  noiseLevel: NoiseLevel;
  view: 'dashboard' | 'manifesto' | 'void' | 'blackbox';
  nightMode: boolean;
  chaosCredits: number; // Limit "Good Chaos" usage
}

export interface Reply {
  id: string;
  content: string;
  timestamp: number;
  authorName?: string;
  authorId?: string;
}

export interface Post {
  id: string;
  content: string;
  timestamp: number;
  echoes: {
    feel: number;
    chaos: number;
    alone: number;
  };
  replies: Reply[];
  authorName?: string;
  authorId?: string;
  isSystem?: boolean;
}

export interface Win {
  id: string;
  content: string;
}

export interface MoodStats {
  overthinking: number;
  numb: number;
  angry: number;
  calm: number;
  sarcastic: number;
}