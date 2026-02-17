import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Coffee } from 'lucide-react';

interface ManifestoProps {
  onBack: () => void;
}

const Manifesto: React.FC<ManifestoProps> = ({ onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl mx-auto py-12 px-6 md:px-0 text-stone-400 font-sans leading-relaxed"
    >
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-300 transition-colors mb-12 uppercase tracking-widest"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Return to the noise
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-stone-200 mb-10 tracking-tight">
        Why this place exists
      </h1>

      <div className="space-y-12 text-base md:text-lg font-light">
        <section>
          <p>
            We built this space because we were tired. Tired of curating profiles, tired of optimizing our lives, and tired of pretending to be okay when we weren't.
          </p>
          <p className="mt-4">
            This is a place where you don’t have to perform. You don't have to be productive, interesting, or "good." You just have to exist.
          </p>
        </section>

        <section className="border-l-2 border-stone-800 pl-6 py-2">
          <h2 className="text-stone-300 font-semibold mb-3 text-sm uppercase tracking-wide opacity-80">This is not social media</h2>
          <ul className="space-y-2 text-stone-500">
            <li>No profiles to manicure.</li>
            <li>No followers to impress.</li>
            <li>No "likes" to chase.</li>
            <li>No history to haunt you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-stone-200 font-semibold mb-4">A Note on the Name</h2>
          <p>
            "Fuck Society" isn't about hating the world or the people in it. <br/>
            <span className="text-stone-300">It's about resting from it.</span>
          </p>
          <p className="mt-4">
            It's a rejection of the pressure to always be "on." It's a refusal to participate in the race for a few minutes. It is a quiet rebellion of sitting still.
          </p>
        </section>

        <section>
          <h2 className="text-stone-200 font-semibold mb-4">The Culture Here</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white/[0.03] p-6 rounded-2xl">
              <span className="block text-stone-300 font-medium mb-2">No Advice</span>
              <p className="text-sm text-stone-500">Unless someone explicitly asks, we don't fix them. We just witness them.</p>
            </div>
            <div className="bg-white/[0.03] p-6 rounded-2xl">
              <span className="block text-stone-300 font-medium mb-2">No Judgement</span>
              <p className="text-sm text-stone-500">Your darkness is welcome here. Your weirdness is welcome here.</p>
            </div>
          </div>
        </section>

        <section>
            <h2 className="text-stone-200 font-semibold mb-4">Anonymity</h2>
            <p>
                You were given a name like <span className="italic">QuietFox</span> or <span className="italic">TiredStar</span>. You didn't choose it. This is intentional. Without a persistent identity, you are free to be honest without consequence.
            </p>
        </section>

        <section className="pt-8 border-t border-white/5 opacity-60">
            <p className="text-sm italic">
                Built by someone who needed a place like this.
            </p>
        </section>

        <section className="pt-8 pb-20">
            <p className="text-stone-300 font-medium">
                You don't have to stay. <br/>
                You're welcome whenever you need.
            </p>
        </section>
      </div>
    </motion.div>
  );
};

export default Manifesto;