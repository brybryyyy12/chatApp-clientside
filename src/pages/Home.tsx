import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-1 relative flex-col items-center justify-center bg-[#0F172A] w-full h-full overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-blue-600/10 rounded-full blur-[100px] lg:blur-[150px] animate-pulse pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center p-6">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/40">
          <span className="text-5xl lg:text-7xl font-black text-white italic select-none">A</span>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-[0.2em] uppercase">AuraChat</h2>
          <p className="text-slate-500 mt-2 font-light text-sm lg:text-base">Encrypted. Instant. Beautiful.</p>
        </div>

        <div className="mt-12">
          <span className="px-5 py-2.5 rounded-full border border-white/10 text-[10px] lg:text-xs text-slate-400 bg-white/5 backdrop-blur-md">
            Select a conversation to begin
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;