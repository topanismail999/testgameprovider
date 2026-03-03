import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- 1. DATA & INTERFACES ---
interface Game {
  id: string;
  name: string;
  provider: string;
  image: string;
  hot: boolean;
  rtp: number;
  demoUrl: string;
}

const PROVIDERS = ["ALL", "PRAGMATIC", "PG SOFT", "HABANERO", "JOKER", "SPADEGAMING"];

const GAMES: Game[] = [
  // Pragmatic Play
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'PRAGMATIC', image: '⚡', hot: true, rtp: 98.5, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=en&cur=IDR' },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'PRAGMATIC', image: '⭐', hot: false, rtp: 96.2, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20starlight&lang=en&cur=IDR' },
  
  // PG Soft (Mockup Link)
  { id: 'mahjong-ways-2', name: 'Mahjong Ways 2', provider: 'PG SOFT', image: '🀄', hot: true, rtp: 97.1, demoUrl: 'https://m.pgsoft-games.com/126/index.html' },
  { id: 'lucky-neko', name: 'Lucky Neko', provider: 'PG SOFT', image: '🐱', hot: false, rtp: 96.8, demoUrl: 'https://m.pgsoft-games.com/105/index.html' },
  
  // Habanero
  { id: 'koigate', name: 'Koi Gate', provider: 'HABANERO', image: '🐟', hot: true, rtp: 98.2, demoUrl: 'https://demo-pff.hanabero.com/koi-gate' },
  
  // Joker & Others
  { id: 'roma', name: 'Roma', provider: 'JOKER', image: '🛡️', hot: true, rtp: 95.5, demoUrl: 'https://www.jokerapp678.net/demo/roma' },
  { id: 'sugar-rush', name: 'Sugar Rush', provider: 'PRAGMATIC', image: '🍬', hot: true, rtp: 97.5, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20sugarrush&lang=en&cur=IDR' },
  { id: 'legacy-kong', name: 'Legacy of Kong', provider: 'SPADEGAMING', image: '🦍', hot: false, rtp: 94.2, demoUrl: 'https://demo.spadegaming.com/legacy-kong' },
];

const PROMOS = [
  { id: 1, title: "BONUS NEW MEMBER 100%", sub: "Berlaku untuk Semua Provider Slot", color: "from-indigo-600 to-blue-900" },
  { id: 2, title: "CASHBACK MINGGUAN 5%", sub: "Dibagikan Setiap Hari Selasa", color: "from-red-600 to-rose-950" },
];

export default function GameApp() {
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");

  // Auto-slide Promo
  useEffect(() => {
    const timer = setInterval(() => setCurrentPromo(p => (p + 1) % PROMOS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter Logic
  const filteredGames = activeTab === "ALL" 
    ? GAMES 
    : GAMES.filter(g => g.provider === activeTab);

  const launchGame = (url: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedGameUrl(url);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-black">N</div>
          <h1 className="font-black text-white italic uppercase tracking-tighter">NEXUS<span className="text-yellow-500 not-italic">HUB</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900/80 px-4 py-1.5 rounded-full border border-white/10">
            <p className="text-[10px] text-emerald-400 font-black font-mono">IDR 12.450.000</p>
          </div>
        </div>
      </nav>

      {/* --- HERO BANNER --- */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className={`w-full h-44 md:h-56 rounded-[2rem] p-8 relative overflow-hidden bg-gradient-to-br ${PROMOS[currentPromo].color} transition-all duration-1000 shadow-2xl border border-white/10`}>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase leading-none">{PROMOS[currentPromo].title}</h2>
            <p className="text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">{PROMOS[currentPromo].sub}</p>
            <button className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase w-max shadow-xl hover:scale-105 transition-transform">Daftar Sekarang</button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* --- PROVIDER SELECTOR --- */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {PROVIDERS.map((p) => (
            <button 
              key={p} 
              onClick={() => setActiveTab(p)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all border ${
                activeTab === p ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* --- GAME GRID --- */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-yellow-500 rounded-full"></div>
          <h3 className="font-black text-xs uppercase tracking-widest">Daftar Game <span className="text-yellow-500">{activeTab}</span></h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filteredGames.map((game) => (
            <div key={game.id} onClick={() => launchGame(game.demoUrl)} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-[2rem] bg-slate-900 border border-white/5 relative overflow-hidden transition-all duration-500 group-hover:border-yellow-500/50 group-hover:-translate-y-2">
                
                {/* Visual */}
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-b from-slate-800 to-slate-950 group-hover:scale-110 transition-transform duration-700">
                  {game.image}
                </div>

                {/* RTP Widget */}
                <div className="absolute bottom-0 left-0 w-full p-3 bg-black/70 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[7px] font-black text-white/40 uppercase">RTP Live</span>
                    <span className="text-[9px] font-black text-emerald-400">{game.rtp}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${game.rtp}%` }}></div>
                  </div>
                </div>

                {/* Hot Tag */}
                {game.hot && (
                  <div className="absolute top-4 left-4 bg-red-600 text-[7px] font-black px-2 py-0.5 rounded-full text-white uppercase italic animate-pulse">Hot</div>
                )}
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-[10px] font-black text-slate-300 uppercase truncate px-2">{game.name}</h4>
                <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{game.provider}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL GAME --- */}
      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="h-14 bg-slate-950 flex justify-between items-center px-6 border-b border-white/10">
            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-tighter italic">Nexus Aggregator v.2.0</p>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase transition-transform active:scale-90">Tutup</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen />
        </div>
      )}

      {/* --- LOADING --- */}
      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.5em] animate-pulse">Connecting to API...</p>
        </div>
      )}

    </div>
  );
}

// RENDER
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<React.StrictMode><GameApp /></React.StrictMode>);
