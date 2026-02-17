import { MoodStats, Post, Win } from './types';

export const SYSTEM_MESSAGES = [
  "It makes sense that you feel this way.",
  "You don't need to explain yourself.",
  "I'm here. You can take this slow.",
  "It’s okay if it doesn’t feel okay.",
  "We can just exist here for a moment.",
];

export const INITIAL_WALL_POSTS: Post[] = [
  { 
    id: '1', 
    content: "I'm just really tired of trying so hard.", 
    timestamp: Date.now(), 
    echoes: { feel: 12, chaos: 4, alone: 8 },
    authorName: 'TiredStar',
    replies: [
        { id: 'r1', content: "Rest is productive too.", timestamp: Date.now(), authorName: 'SoftMoon' }
    ]
  },
  { 
    id: '2', 
    content: "It feels like everyone else has the manual but me.", 
    timestamp: Date.now() - 100000, 
    echoes: { feel: 45, chaos: 10, alone: 22 },
    authorName: 'BluePetal',
    replies: [
        { id: 'r2', content: "I feel lost often too.", timestamp: Date.now(), authorName: 'QuietFox' },
        { id: 'r3', content: "There is no manual, we're all improvising.", timestamp: Date.now(), authorName: 'StillRiver' }
    ]
  },
  { 
    id: '3', 
    content: "I don't know if I'm doing this right.", 
    timestamp: Date.now() - 200000, 
    echoes: { feel: 5, chaos: 2, alone: 15 },
    authorName: 'FaintCloud',
    replies: []
  },
  { 
    id: '4', 
    content: "Everything is just... heavy today.", 
    timestamp: Date.now() - 300000, 
    echoes: { feel: 30, chaos: 40, alone: 2 },
    authorName: 'GrayRain',
    replies: [
        { id: 'r4', content: "I hear you.", timestamp: Date.now(), authorName: 'GentleWind' },
        { id: 'r5', content: "Putting the weight down for a moment with you.", timestamp: Date.now(), authorName: 'SoftMoon' }
    ]
  },
];

export const INITIAL_WINS: Win[] = [
  { id: '1', content: "Got out of bed." },
  { id: '2', content: "Pausing to breathe." },
  { id: '3', content: "Being gentle with myself." },
  { id: '4', content: "Survived the morning." },
];

export const INITIAL_MOODS: MoodStats = {
  overthinking: 35,
  numb: 20,
  angry: 15,
  calm: 10,
  sarcastic: 20,
};

export const CHAOS_LINES = [
  "You don't have to be productive right now.",
  "It makes sense that you're exhausted.",
  "You are allowed to take up space.",
  "Your pain is valid, even if it's quiet.",
  "You don't have to fix everything today.",
  "I hear you.",
];

export const RELIEF_LINES = [
  "Let's just sit here for a minute.",
  "The world can wait outside.",
  "You don't have to perform here.",
  "Your best is enough, whatever that looks like today.",
  "It's okay to put the heavy things down.",
  "Breathe. I'm with you.",
];

export const GENTLE_LINES = [
  "You don't need to apologize for how you feel.",
  "Take all the time you need.",
  "There is no deadline for healing.",
  "It's okay to not be okay right now.",
  "You don't have to impress anyone.",
  "Rest your eyes. I'm here.",
];

// Reflective responses instead of "release" feedback
export const REFLECTIVE_RESPONSES = [
  "That sounds exhausting.",
  "It makes sense you feel that way.",
  "It’s heavy to carry that alone.",
  "Thank you for trusting us with that.",
  "I hear how hard that is.",
  "You're not wrong for feeling this.",
];

// Optional gentle follow-ups
export const GENTLE_PROMPTS = [
  "Do you want to let out a little more?",
  "What part of this feels heaviest?",
  "Is there a knot you want to untie?",
  "If you could say one more thing, what would it be?",
];

export const NIGHT_MESSAGES = [
  "The night is a safe place to rest.",
  "You've carried enough for today.",
  "Let the quiet hold you for a bit.",
  "It's okay to stop thinking now.",
];

export const REPLY_STARTERS = [
  "I hear you.",
  "That sounds really heavy.",
  "You’re not alone in this.",
  "I don’t have advice, but I’m here.",
  "It makes sense to feel this.",
  "Sending quiet support."
];

// Soft Identity Generation Lists
export const ID_ADJECTIVES = [
  "Quiet", "Soft", "Still", "Blue", "Tired", 
  "Gentle", "Faint", "Pale", "Lost", "Calm", 
  "Heavy", "Deep", "Slow", "Warm", "Cold"
];

export const ID_NOUNS = [
  "Fox", "Moon", "River", "Petal", "Star", 
  "Cloud", "Rain", "Echo", "Ghost", "Wind", 
  "Shadow", "Fern", "Moss", "Stone", "Wave"
];