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

const PROVIDERS = ["ALL", "PRAGMATIC", "PG SOFT", "HABANERO", "JOKER", "SPADEGAMING", "CQ9", "MICROGAMING"];

const GAMES: Game[] = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'PRAGMATIC', image: '⚡', hot: true, rtp: 98.5, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=en&cur=IDR' },
  { id: 'mahjong-ways-2', name: 'Mahjong Ways 2', provider: 'PG SOFT', image: '🀄', hot: true, rtp: 97.1, demoUrl: 'https://m.pgsoft-games.com/126/index.html' },
  { id: 'koigate', name: 'Koi Gate', provider: 'HABANERO', image: '🐟', hot: true, rtp: 98.2, demoUrl: 'https://demo-pff.hanabero.com/koi-gate' },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'PRAGMATIC', image: '⭐', hot: false, rtp: 96.2, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20starlight&lang=en&cur=IDR' },
  { id: 'lucky-neko', name: 'Lucky Neko', provider: 'PG SOFT', image: '🐱', hot: false, rtp: 96.8, demoUrl: 'https://m.pgsoft-games.com/105/index.html' },
  { id: 'roma', name: 'Roma', provider: 'JOKER', image: '🛡️', hot: true, rtp: 95.5, demoUrl: 'https://www.jokerapp678.net/demo/roma' },
];

const WINNERS = [
  { user: "user_77***", win: "IDR 2.450.000", game: "Gates of Olympus" },
  { user: "jack***01", win: "IDR 8.120.000", game: "Mahjong Ways 2" },
  { user: "slot***pro", win: "IDR 1.200.000", game: "Koi Gate" },
];

export default function GameApp() {
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [jackpot, setJackpot] = useState(8234567890);

  // Jackpot Counter Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 5000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredGames = activeTab === "ALL" ? GAMES : GAMES.filter(g => g.provider === activeTab);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32">
      
      {/* 1. TOP MARQUEE (RUNNING TEXT) */}
      <div className="bg-yellow-500 text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-yellow-600">
        <div className="animate-marquee inline-block font-black text-[10px] uppercase tracking-tighter">
          Selamat Datang di NEXUSHUB - Situs Slot Terpercaya dengan Winrate Tertinggi 98.5% ● Maintenance Rutin Setiap Hari Selasa Jam 07:00 WIB ● Deposit via QRIS Proses Hanya 5 Detik! ●
        </div>
      </div>

      {/* 2. NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">N</div>
          <h1 className="font-black text-white italic uppercase tracking-tighter text-xl">NEXUS<span className="text-yellow-500 not-italic">HUB</span></h1>
        </div>
        <div className="flex gap-2">
          <button className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-white/10">Masuk</button>
          <button className="bg-yellow-500 text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg shadow-yellow-500/20">Daftar</button>
        </div>
      </nav>

      {/* 3. JACKPOT COUNTER */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 border border-yellow-500/30 text-center relative overflow-hidden shadow-2xl">
          <p className="text-yellow-500 font-black text-[10px] uppercase tracking-[0.5em] mb-2">Global Progressive Jackpot</p>
          <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter">
            IDR {jackpot.toLocaleString('id-ID')}
          </h2>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* 4. PROVIDER TABS */}
      <div className="max-w-7xl mx-auto px-6 mt-8 overflow-x-auto no-scrollbar flex gap-2">
        {PROVIDERS.map(p => (
          <button 
            key={p} 
            onClick={() => setActiveTab(p)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all border ${
              activeTab === p ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg' : 'bg-slate-900 text-slate-500 border-white/5'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 5. MAIN GAMES GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredGames.map((game) => (
            <div key={game.id} onClick={() => { setIsLoading(true); setTimeout(() => { setSelectedGameUrl(game.demoUrl); setIsLoading(false); }, 1000); }} className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-3xl bg-slate-900 border border-white/5 relative overflow-hidden transition-all group-hover:border-yellow-500/50 group-hover:-translate-y-2">
                <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-b from-slate-800 to-black group-hover:scale-110 transition-transform duration-700">
                  {game.image}
                </div>
                {/* RTP Label */}
                <div className="absolute bottom-0 left-0 w-full p-3 bg-black/80 backdrop-blur-md">
                   <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-emerald-500" style={{ width: `${game.rtp}%` }}></div>
                   </div>
                   <p className="text-[8px] font-black text-center text-emerald-400 uppercase tracking-widest">RTP {game.rtp}%</p>
                </div>
              </div>
              <p className="mt-2 text-[10px] font-bold text-center text-slate-400 uppercase truncate px-2">{game.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RECENT WINNERS (LIVE FEED) */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Pemenang Terkini
          </h3>
          <div className="space-y-3">
            {WINNERS.map((w, i) => (
              <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] font-black text-white">{w.user}</p>
                  <p className="text-[8px] text-slate-500 uppercase">{w.game}</p>
                </div>
                <p className="text-[11px] font-black text-emerald-400">{w.win}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. FOOTER (CREDIBILITY) */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 pt-10 border-t border-white/5 text-center">
        <div className="flex flex-wrap justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholder untuk logo bank/provider */}
           <div className="font-black text-xl italic text-white">BCA</div>
           <div className="font-black text-xl italic text-white">BNI</div>
           <div className="font-black text-xl italic text-white">BRI</div>
           <div className="font-black text-xl italic text-white">QRIS</div>
        </div>
        <p className="mt-10 text-[9px] text-slate-600 uppercase font-bold tracking-[0.3em]">
          &copy; 2024 NEXUSHUB Entertainment. All Rights Reserved. 18+ Only.
        </p>
      </footer>

      {/* 8. FLOATING ACTION BUTTON (WHATSAPP) */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
           <span className="text-white font-black text-xs uppercase">Help</span>
        </div>
      </div>

      {/* MODAL & LOADING */}
      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="h-12 bg-slate-900 flex justify-between items-center px-6">
            <p className="text-[10px] font-black text-yellow-500 uppercase italic">Live Game Engine</p>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-4 py-1 rounded text-[10px] font-black">CLOSE</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* TAMBAHKAN CSS ANIMASI KE INDEX.CSS ANDA */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// RENDER
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<React.StrictMode><GameApp /></React.StrictMode>);
