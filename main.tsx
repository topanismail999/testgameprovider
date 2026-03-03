import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA GAME (Bisa ditambah sesuai katalog Pragmatic) ---
const GAMES = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'Pragmatic Play', image: '⚡', hot: true },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'Pragmatic Play', image: '⭐', hot: false },
  { id: 'vs20sweetbonz', name: 'Sweet Bonanza', provider: 'Pragmatic Play', image: '🍭', hot: true },
  { id: 'vs20wildwest', name: 'Wild West Gold', provider: 'Pragmatic Play', image: '🤠', hot: false },
  { id: 'vs20doghouse', name: 'The Dog House', provider: 'Pragmatic Play', image: '🐶', hot: false },
  { id: 'vs20joker', name: 'Joker Jewels', provider: 'Pragmatic Play', image: '🃏', hot: true },
];

const GameCatalog = () => {
  const [filter, setFilter] = useState('Semua');
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ========================================================
  // BAGIAN 1: LOGIKA PEMANGGILAN GAME (TANDAI BAGIAN INI)
  // ========================================================
  const launchGame = async (gameId: string) => {
    setIsLoading(true);
    
    try {
      /**
       * !!! TANYAKAN SAYA TENTANG BAGIAN INI NANTI !!!
       * Di sini kita akan mengganti 'fetch' ke endpoint API asli Anda.
       * Bagian ini memerlukan: OperatorID, SecretKey, dan PlayerID.
       */
      
      // Simulasi loading 1.5 detik seolah-olah sedang meminta tiket ke Server Pragmatic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // MOCK URL: Sementara kita gunakan demo link untuk testing
      const mockDemoUrl = `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${gameId}&lang=en&cur=IDR`;
      
      setSelectedGameUrl(mockDemoUrl);
    } catch (error) {
      alert("Gagal memuat game. Silakan cek koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20 selection:bg-yellow-500/30">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 font-black text-slate-900 text-xl">P</div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">Nexus<span className="text-yellow-500 text-sm ml-1 not-italic font-bold">GAMES</span></h1>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo</p>
                <p className="text-sm font-black text-emerald-400 font-mono italic">IDR 2.500.000</p>
             </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden border border-slate-700/50 flex items-center">
            <div className="relative z-10">
                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Pragmatic Play Official</span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">Win The <span className="text-yellow-500">Jackpot</span></h2>
            </div>
        </div>
      </div>

      {/* --- FILTER CATEGORY --- */}
      <div className="max-w-7xl mx-auto px-6 mt-10 flex gap-3 overflow-x-auto no-scrollbar">
        {['Semua', 'Slot', 'Casino', 'Hot'].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-slate-700 text-yellow-500 border border-yellow-500/50' : 'bg-slate-800/50 text-slate-400 border border-slate-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* --- GRID GAME --- */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {GAMES.map((game) => (
            <motion.div 
              whileHover={{ y: -8 }} 
              key={game.id} 
              className="group relative cursor-pointer"
              onClick={() => launchGame(game.id)}
            >
              <div className="aspect-[3/4] rounded-[2rem] bg-slate-800 border border-slate-700 overflow-hidden relative shadow-xl group-hover:border-yellow-500/50">
                <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-125 transition-transform duration-500 grayscale group-hover:grayscale-0">
                  {game.image}
                </div>
                {game.hot && <div className="absolute top-4 left-4 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase animate-pulse">Hot</div>}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                   <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 shadow-xl">▶</div>
                   <p className="mt-2 text-[10px] font-black uppercase text-yellow-500">Play Now</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-[11px] font-black uppercase truncate">{game.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================================
          BAGIAN 2: IFRAME GAME MODAL (TANDAI BAGIAN INI)
          ======================================================== */}
      <AnimatePresence>
        {selectedGameUrl && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col"
          >
            {/* Toolbar Game */}
            <div className="h-14 bg-slate-900/50 flex justify-between items-center px-6 border-b border-white/10">
              <span className="text-[10px] font-black text-yellow-500 tracking-widest uppercase italic">Nexus Live Stream</span>
              <button 
                onClick={() => setSelectedGameUrl(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all shadow-lg shadow-red-500/20"
              >
                Tutup Game
              </button>
            </div>
            
            {/* Container Iframe */}
            <div className="flex-1 w-full relative">
              <iframe 
                src={selectedGameUrl} 
                className="w-full h-full border-none"
                allowFullScreen
                title="Game Frame"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Menghubungkan ke Server...</p>
           </div>
        </div>
      )}

    </div>
  );
};

export default GameCatalog;
