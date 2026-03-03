import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- 1. DATA & INTERFACES ---
interface Game {
  id: string;
  name: string;
  provider: string;
  image: string;
  hot: boolean;
  rtp: number; // Tambahkan nilai RTP
}

const GAMES: Game[] = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '⚡', hot: true, rtp: 98.5 },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'Pragmatic Play', image: '⭐', hot: false, rtp: 96.2 },
  { id: 'vs20sweetbonz', name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '🍭', hot: true, rtp: 97.8 },
  { id: 'vs20wildwest', name: 'Wild West Gold', provider: 'Pragmatic Play', image: '🤠', hot: false, rtp: 94.5 },
  { id: 'vs20doghouse', name: 'The Dog House', provider: 'Pragmatic Play', image: '🐶', hot: false, rtp: 95.1 },
  { id: 'vs20joker', name: 'Joker Jewels', provider: 'Pragmatic Play', image: '🃏', hot: true, rtp: 93.2 },
];

const PROMOS = [
  { id: 1, title: "WELCOME BONUS 100%", sub: "Khusus Member Baru", color: "from-blue-600 to-indigo-900" },
  { id: 2, title: "REBATE HARIAN 0.8%", sub: "Tanpa Batas Setiap Hari", color: "from-purple-600 to-fuchsia-900" },
  { id: 3, title: "EVENT PETIR ZEUS", sub: "Extra Perkalian s/d x500", color: "from-amber-500 to-red-800" },
];

// --- 2. KOMPONEN UTAMA ---
export default function GameApp() {
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPromo, setCurrentPromo] = useState(0);

  // Auto-slide Promo Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % PROMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const launchGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameId}&lang=en&cur=IDR`;
      setSelectedGameUrl(mockUrl);
    } catch (e) {
      alert("Gagal memuat game");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 selection:bg-yellow-500 selection:text-black">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-lg flex items-center justify-center font-black text-black shadow-lg shadow-yellow-500/20">N</div>
            <h1 className="font-black tracking-tighter text-white italic uppercase text-lg">NEXUS<span className="text-yellow-500 not-italic">SLOT</span></h1>
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden md:block text-right">
              <p className="text-[9px] text-slate-500 font-black uppercase leading-none">VIP Status</p>
              <p className="text-[10px] font-bold text-yellow-500 uppercase">Platinum Member</p>
            </div>
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
              <p className="text-[8px] text-slate-500 font-black uppercase leading-none mb-1">Dompet Utama</p>
              <p className="text-sm font-black text-emerald-400 font-mono tracking-tighter">IDR 5.250.000</p>
            </div>
          </div>
        </div>
      </nav>

      {/* --- PROMO CAROUSEL --- */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className={`w-full h-48 md:h-60 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden transition-all duration-700 bg-gradient-to-br ${PROMOS[currentPromo].color} shadow-2xl`}>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <span className="bg-black/20 w-max px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 backdrop-blur-sm">Exclusive Promo</span>
            <h2 className="text-3xl md:text-5xl font-black text-white italic leading-none uppercase tracking-tighter animate-in slide-in-from-left duration-500">
              {PROMOS[currentPromo].title}
            </h2>
            <p className="text-sm md:text-lg text-white/80 mt-2 font-medium">
              {PROMOS[currentPromo].sub}
            </h2>
            <button className="mt-6 bg-white text-black text-[10px] font-black uppercase px-6 py-3 rounded-xl w-max hover:bg-yellow-500 transition-colors shadow-xl">Klaim Sekarang</button>
          </div>
          
          {/* Dekorasi Abstract */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
             <div className="absolute top-10 right-10 w-32 h-32 border-8 border-white rounded-full"></div>
             <div className="absolute -bottom-10 right-20 w-48 h-48 border-[16px] border-white/50 rounded-full"></div>
          </div>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-6 right-10 flex gap-2">
            {PROMOS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPromo ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RTP & GAMES SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
              <h3 className="font-black uppercase tracking-[0.2em] text-xs text-white">Live RTP <span className="text-yellow-500">Pragmatic Play</span></h3>
            </div>
            <div className="flex gap-2">
               <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black uppercase text-emerald-400">● Online</div>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {GAMES.map((game) => (
            <div key={game.id} onClick={() => launchGame(game.id)} className="group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-[2rem] bg-[#0f172a] border border-white/5 overflow-hidden shadow-xl transition-all duration-500 group-hover:border-yellow-500/50 group-hover:-translate-y-2 group-hover:shadow-yellow-500/10">
                
                {/* Image / Emoji */}
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-b from-[#1e293b] to-[#020617] group-hover:scale-110 transition-transform duration-700">
                  {game.image}
                </div>

                {/* RTP BANNER (WIDGET) */}
                <div className="absolute bottom-0 left-0 w-full p-3 bg-black/60 backdrop-blur-md border-t border-white/10">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-tighter">Win Rate</span>
                        <span className={`text-[10px] font-black ${game.rtp > 95 ? 'text-emerald-400' : 'text-yellow-500'}`}>{game.rtp}%</span>
                    </div>
                    {/* Progress Bar RTP */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${game.rtp > 95 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-yellow-500'}`} 
                          style={{ width: `${game.rtp}%` }}
                        ></div>
                    </div>
                </div>

                {/* Hot Tag */}
                {game.hot && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-orange-600 text-[8px] font-black px-2 py-0.5 rounded-full text-white uppercase italic shadow-lg animate-pulse">Hot</div>
                )}

                {/* Overlay Play */}
                <div className="absolute inset-0 bg-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
                       <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-[11px] font-black text-slate-300 group-hover:text-yellow-500 uppercase tracking-tighter transition-colors">{game.name}</h4>
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{game.provider}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL & LOADING (Sama seperti sebelumnya) */}
      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="h-14 bg-[#0f172a] flex justify-between items-center px-4 border-b border-white/10">
            <p className="text-[10px] font-black text-yellow-500 tracking-tighter uppercase italic">Nexus Slot Engine x Pragmatic</p>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase transition-all active:scale-90">Keluar Game</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen title="game" />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-[#020617]/95 backdrop-blur-md flex flex-col items-center justify-center">
           <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] animate-pulse">Menghubungkan ke Server...</p>
        </div>
      )}

    </div>
  );
}

// RENDER
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><GameApp /></React.StrictMode>);
}
