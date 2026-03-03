import React, { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState<{username: string, balance: number} | null>(null);
  const [jackpot, setJackpot] = useState(8234567890);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const jTimer = setInterval(() => setJackpot(p => p + Math.floor(Math.random() * 5000)), 2000);
    return () => clearInterval(jTimer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32">
      <div className="bg-yellow-500 text-black py-1.5 overflow-hidden border-b border-yellow-600 text-[10px] font-black uppercase">
        <div className="animate-marquee inline-block whitespace-nowrap">
          WELCOME TO NEXUSHUB ● DEPOSIT QRIS OTOMATIS ● WD TANPA RIBET ●
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black">N</div>
          <h1 className="font-black text-white italic uppercase tracking-tighter text-xl">NEXUS<span className="text-yellow-500 not-italic">HUB</span></h1>
        </div>
        {user && (
          <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10">
            <p className="text-[8px] text-slate-500 font-black uppercase text-center">Saldo</p>
            <p className="text-sm font-black text-emerald-400 font-mono italic">IDR {user.balance.toLocaleString('id-ID')}</p>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-6 text-center">
        <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-8 border border-yellow-500/20 shadow-2xl">
          <p className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.5em] mb-2 opacity-70">Global Jackpot</p>
          <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter italic">IDR {jackpot.toLocaleString('id-ID')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-12">
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden group cursor-pointer hover:border-yellow-500/50 transition-all">
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-b from-slate-800 to-black group-hover:scale-110 transition-transform">🎰</div>
                </div>
            ))}
        </div>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 30s linear infinite; }`}</style>
    </div>
  );
}
