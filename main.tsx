import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// --- 1. DATA GAME ---
interface Game {
  id: string;
  name: string;
  provider: string;
  image: string;
  hot: boolean;
}

const GAMES: Game[] = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '⚡', hot: true },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'Pragmatic Play', image: '⭐', hot: false },
  { id: 'vs20sweetbonz', name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '🍭', hot: true },
  { id: 'vs20wildwest', name: 'Wild West Gold', provider: 'Pragmatic Play', image: '🤠', hot: false },
  { id: 'vs20doghouse', name: 'The Dog House', provider: 'Pragmatic Play', image: '🐶', hot: false },
  { id: 'vs20joker', name: 'Joker Jewels', provider: 'Pragmatic Play', image: '🃏', hot: true },
];

// --- 2. KOMPONEN UTAMA ---
export default function GameApp() {
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const launchGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameId}&lang=en&cur=IDR`;
      setSelectedGameUrl(mockUrl);
    } catch (e) {
      alert("Koneksi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-black">N</div>
            <h1 className="font-black tracking-tighter text-white italic uppercase">NEXUS<span className="text-yellow-500 not-italic">SLOT</span></h1>
          </div>
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <p className="text-[10px] text-slate-500 font-bold uppercase leading-none text-center">Saldo</p>
            <p className="text-sm font-black text-emerald-400 font-mono">IDR 5.000.000</p>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="w-full h-40 md:h-52 bg-gradient-to-br from-indigo-950 via-slate-900 to-[#020617] rounded-3xl p-8 relative overflow-hidden border border-white/10 flex items-center shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black text-white italic leading-none uppercase">MEGA <span className="text-yellow-500">JACKPOT</span></h2>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold opacity-70">Official Pragmatic Partner</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-yellow-500/10 blur-[80px] rounded-full"></div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-yellow-500"></div>
            <h3 className="font-black uppercase tracking-widest text-[11px] text-white">Populer Sekarang</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {GAMES.map((game) => (
            <div key={game.id} onClick={() => launchGame(game.id)} className="group cursor-pointer active:scale-95 transition-all">
              <div className="aspect-[3/4] rounded-2xl bg-[#0f172a] border border-white/5 overflow-hidden relative shadow-xl group-hover:border-yellow-500/50">
                <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-b from-[#1e293b] to-[#020617] group-hover:scale-110 transition-transform duration-500">
                  {game.image}
                </div>
                {game.hot && (
                  <div className="absolute top-3 left-3 bg-red-600 text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase italic">Hot</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xl shadow-lg">▶</div>
                </div>
              </div>
              <h4 className="mt-3 text-[10px] font-bold text-center text-slate-400 group-hover:text-yellow-500 uppercase truncate px-2 transition-colors">{game.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* GAME MODAL */}
      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col transition-all">
          <div className="h-14 bg-[#0f172a] flex justify-between items-center px-4 border-b border-white/10">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <p className="text-[10px] font-black text-yellow-500 tracking-tighter uppercase italic">Live Playing</p>
            </div>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase">Tutup</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen title="game" />
        </div>
      )}

      {/* LOADING */}
      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
}

// --- 3. PROSES RENDER (MENGHUBUNGKAN KE HTML) ---
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <GameApp />
    </React.StrictMode>
  );
}
