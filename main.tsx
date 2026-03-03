import React, { useState } from 'react';

// --- DATA GAME ---
const GAMES = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '⚡', hot: true },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'Pragmatic Play', image: '⭐', hot: false },
  { id: 'vs20sweetbonz', name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '🍭', hot: true },
  { id: 'vs20wildwest', name: 'Wild West Gold', provider: 'Pragmatic Play', image: '🤠', hot: false },
  { id: 'vs20doghouse', name: 'The Dog House', provider: 'Pragmatic Play', image: '🐶', hot: false },
  { id: 'vs20joker', name: 'Joker Jewels', provider: 'Pragmatic Play', image: '🃏', hot: true },
];

export default function GameApp() {
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ========================================================
  // BAGIAN 1: LOGIKA PEMANGGILAN GAME (TANDAI BAGIAN INI)
  // ========================================================
  const launchGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      // Simulasi delay koneksi ke server provider
      await new Promise(resolve => setTimeout(resolve, 1200));

      // MOCK URL: Link Demo Pragmatic untuk testing visual
      const mockUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameId}&lang=en&cur=IDR`;
      setSelectedGameUrl(mockUrl);
    } catch (e) {
      alert("Koneksi terputus");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-black">N</div>
            <h1 className="font-black tracking-tighter text-white italic uppercase">NEXUS<span className="text-yellow-500 not-italic">SLOT</span></h1>
          </div>
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Saldo</p>
            <p className="text-sm font-black text-emerald-400 font-mono">IDR 5.000.000</p>
          </div>
        </div>
      </nav>

      {/* --- HERO BANNER --- */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="w-full h-40 md:h-52 bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-3xl p-8 relative overflow-hidden border border-white/10 flex items-center">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black text-white italic leading-none uppercase">MEGA <span className="text-yellow-500">JACKPOT</span></h2>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-[0.2em] font-bold">Pragmatic Play Official Partner</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full"></div>
        </div>
      </div>

      {/* --- GRID GAME --- */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-yellow-500"></div>
            <h3 className="font-black uppercase tracking-widest text-xs text-white">Populer Sekarang</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {GAMES.map((game) => (
            <div 
              key={game.id} 
              onClick={() => launchGame(game.id)}
              className="group relative cursor-pointer active:scale-95 transition-all duration-200"
            >
              <div className="aspect-[3/4] rounded-2xl bg-slate-900 border border-white/5 overflow-hidden relative shadow-2xl transition-all group-hover:border-yellow-500/50">
                {/* Visual Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-b from-slate-800 to-slate-950 group-hover:scale-110 transition-transform duration-500">
                  {game.image}
                </div>
                
                {/* Hot Label */}
                {game.hot && (
                  <div className="absolute top-3 left-3 bg-red-600 text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase italic">Hot</div>
                )}

                {/* Hover Play Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm shadow-[0_0_20px_rgba(234,179,8,0.4)]">▶</div>
                </div>
              </div>
              <h4 className="mt-3 text-[10px] font-bold text-center text-slate-400 group-hover:text-yellow-500 uppercase truncate px-2">{game.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          BAGIAN 2: IFRAME GAME MODAL (TANDAI BAGIAN INI)
          ======================================================== */}
      {selectedGameUrl && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
          <div className="h-12 bg-slate-900 flex justify-between items-center px-4 border-b border-white/5">
            <p className="text-[10px] font-black text-yellow-500 tracking-tighter uppercase italic">Playing: Pragmatic Play</p>
            <button 
              onClick={() => setSelectedGameUrl(null)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-[10px] font-black uppercase transition-colors"
            >
              Keluar
            </button>
          </div>
          <div className="flex-1 bg-black">
            <iframe 
              src={selectedGameUrl} 
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
}
