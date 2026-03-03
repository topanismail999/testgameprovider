import React, { useState, useEffect } from 'react';

const PROVIDERS = ["ALL", "PRAGMATIC", "PG SOFT", "HABANERO", "JOKER", "SPADEGAMING"];
const PROMOS = [
  { id: 1, title: "BONUS NEW MEMBER 100%", sub: "Berlaku untuk Semua Provider Slot", color: "from-indigo-600 to-blue-900" },
  { id: 2, title: "CASHBACK MINGGUAN 5%", sub: "Dibagikan Setiap Hari Selasa", color: "from-red-600 to-rose-950" },
];
const GAMES = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'PRAGMATIC', image: '⚡', rtp: 98.5, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=en&cur=IDR' },
  { id: 'mahjong-ways-2', name: 'Mahjong Ways 2', provider: 'PG SOFT', image: '🀄', rtp: 97.1, demoUrl: 'https://m.pgsoft-games.com/126/index.html' },
  { id: 'koigate', name: 'Koi Gate', provider: 'HABANERO', image: '🐟', rtp: 98.2, demoUrl: 'https://demo-pff.hanabero.com/koi-gate' },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'PRAGMATIC', image: '⭐', rtp: 96.2, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20starlight&lang=en&cur=IDR' },
];

export default function App() {
  const [activeView, setActiveView] = useState<'HOME' | 'DEPOSIT' | 'WITHDRAW' | 'LOGIN' | 'REGISTER'>('HOME');
  const [user, setUser] = useState<{username: string, balance: number} | null>(null);
  const [jackpot, setJackpot] = useState(8234567890);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const pTimer = setInterval(() => setCurrentPromo(p => (p + 1) % PROMOS.length), 5000);
    const jTimer = setInterval(() => setJackpot(prev => prev + Math.floor(Math.random() * 5000)), 2000);
    return () => { clearInterval(pTimer); clearInterval(jTimer); };
  }, []);

  const filteredGames = activeTab === "ALL" ? GAMES : GAMES.filter(g => g.provider === activeTab);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32 overflow-x-hidden selection:bg-yellow-500">
      <div className="bg-yellow-500 text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-yellow-600 text-[10px] font-black uppercase tracking-widest">
        <div className="animate-marquee inline-block">GATES OF OLYMPUS 1000 GACOR PARAH ● DEPOSIT QRIS OTOMATIS ● WD TANPA RIBET ●</div>
      </div>

      <nav className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('HOME')}>
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black">N</div>
          <h1 className="font-black text-white italic uppercase tracking-tighter text-xl">NEXUS<span className="text-yellow-500 not-italic">HUB</span></h1>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10">
              <p className="text-[8px] text-slate-500 font-black uppercase text-center italic">Saldo</p>
              <p className="text-sm font-black text-emerald-400 font-mono italic">IDR {user.balance.toLocaleString('id-ID')}</p>
            </div>
          ) : (
            <button onClick={() => setActiveView('LOGIN')} className="bg-yellow-500 text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">Login</button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-6">
        <div className={`w-full h-44 md:h-56 rounded-[2.5rem] p-8 relative overflow-hidden bg-gradient-to-br ${PROMOS[currentPromo].color} transition-all duration-1000 shadow-2xl border border-white/10`}>
          <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase leading-none">{PROMOS[currentPromo].title}</h2>
          <p className="text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">{PROMOS[currentPromo].sub}</p>
        </div>

        <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 border border-yellow-500/20 text-center shadow-2xl mt-6">
          <p className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.5em] mb-2">Global Jackpot</p>
          <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter italic">IDR {jackpot.toLocaleString('id-ID')}</h2>
        </div>

        <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar pb-2">
          {PROVIDERS.map(p => (
            <button key={p} onClick={() => setActiveTab(p)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap border ${activeTab === p ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg' : 'bg-slate-900 text-slate-400 border-white/5'}`}>{p}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-8">
          {filteredGames.map((game) => (
            <div key={game.id} onClick={() => { setIsLoading(true); setTimeout(() => { setSelectedGameUrl(game.demoUrl); setIsLoading(false); }, 1000); }} className="group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden group-hover:border-yellow-500/50 transition-all">
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-b from-slate-800 to-black group-hover:scale-110 transition-transform duration-700">{game.image}</div>
                <div className="absolute bottom-0 w-full p-3 bg-black/70 backdrop-blur-md text-center">
                  <p className="text-[9px] font-black text-emerald-400 uppercase">RTP {game.rtp}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="h-12 bg-slate-950 flex justify-between items-center px-6"><p className="text-[10px] font-black text-yellow-500 uppercase italic">Live Game Session</p><button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-4 py-1 rounded text-[10px] font-black uppercase">Close</button></div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.5em] animate-pulse">Loading Game...</p>
        </div>
      )}
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 30s linear infinite; } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
