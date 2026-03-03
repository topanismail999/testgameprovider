import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- 1. DATA & INTERFACES ---
interface Game { id: string; name: string; provider: string; image: string; hot: boolean; rtp: number; demoUrl: string; }

const PROVIDERS = ["ALL", "PRAGMATIC", "PG SOFT", "HABANERO", "JOKER", "SPADEGAMING"];

const GAMES: Game[] = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'PRAGMATIC', image: '⚡', hot: true, rtp: 98.5, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=en&cur=IDR' },
  { id: 'mahjong-ways-2', name: 'Mahjong Ways 2', provider: 'PG SOFT', image: '🀄', hot: true, rtp: 97.1, demoUrl: 'https://m.pgsoft-games.com/126/index.html' },
  { id: 'koigate', name: 'Koi Gate', provider: 'HABANERO', image: '🐟', hot: true, rtp: 98.2, demoUrl: 'https://demo-pff.hanabero.com/koi-gate' },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'PRAGMATIC', image: '⭐', hot: false, rtp: 96.2, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20starlight&lang=en&cur=IDR' },
];

const PROMOS = [
  { id: 1, title: "BONUS NEW MEMBER 100%", sub: "Berlaku untuk Semua Provider Slot", color: "from-indigo-600 to-blue-900" },
  { id: 2, title: "CASHBACK MINGGUAN 5%", sub: "Dibagikan Setiap Hari Selasa", color: "from-red-600 to-rose-950" },
];

// --- 2. KOMPONEN UTAMA ---
export default function GameApp() {
  // Navigation & UI States
  const [activeView, setActiveView] = useState<'HOME' | 'DEPOSIT' | 'WITHDRAW' | 'LOGIN' | 'REGISTER'>('HOME');
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPromo, setCurrentPromo] = useState(0);
  
  // Auth & User States
  const [user, setUser] = useState<{username: string, balance: number} | null>(null);
  const [jackpot, setJackpot] = useState(8234567890);
  
  // Form States
  const [formData, setFormData] = useState({ username: '', password: '', wallet: '' });

  // Persistence: Check if user is already logged in on load
  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const pTimer = setInterval(() => setCurrentPromo(p => (p + 1) % PROMOS.length), 5000);
    const jTimer = setInterval(() => setJackpot(prev => prev + Math.floor(Math.random() * 5000)), 2000);
    return () => { clearInterval(pTimer); clearInterval(jTimer); };
  }, []);

  // --- LOGIKA LOGIN / REGISTER ---
  const handleAuth = (type: 'LOGIN' | 'REGISTER') => {
    if (!formData.username || !formData.password) {
      return alert("Harap isi semua kolom!");
    }
    if (formData.password.length < 6) {
      return alert("Password minimal 6 karakter!");
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const userData = {
        username: formData.username,
        balance: type === 'REGISTER' ? 0 : 5250000 // New user start with 0, existing 5.25m
      };
      
      localStorage.setItem('nexus_user', JSON.stringify(userData));
      setUser(userData);
      setIsLoading(false);
      setActiveView('HOME');
      setFormData({ username: '', password: '', wallet: '' });
      alert(`${type === 'REGISTER' ? 'Pendaftaran' : 'Login'} Berhasil!`);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    setUser(null);
    setActiveView('HOME');
  };

  const filteredGames = activeTab === "ALL" ? GAMES : GAMES.filter(g => g.provider === activeTab);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32 overflow-x-hidden selection:bg-yellow-500">
      
      {/* RUNNING TEXT */}
      <div className="bg-yellow-500 text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-yellow-600 text-[10px] font-black uppercase tracking-widest">
        <div className="animate-marquee inline-block">
          GATES OF OLYMPUS 1000 GACOR PARAH ● DEPOSIT QRIS OTOMATIS ● WD TANPA RIBET ● HUBUNGI CS JIKA ADA KENDALA ●
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('HOME')}>
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black">N</div>
          <h1 className="font-black text-white italic uppercase tracking-tighter text-xl">NEXUS<span className="text-yellow-500 not-italic">HUB</span></h1>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10 hidden md:block">
                <p className="text-[8px] text-slate-500 font-black uppercase text-center">ID: {user.username}</p>
                <p className="text-sm font-black text-emerald-400 font-mono tracking-tighter italic">IDR {user.balance.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={handleLogout} className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => setActiveView('LOGIN')} className="text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Masuk</button>
              <button onClick={() => setActiveView('REGISTER')} className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">Daftar</button>
            </>
          )}
        </div>
      </nav>

      {/* VIEW CONTROLLER */}
      {activeView === 'LOGIN' || activeView === 'REGISTER' ? (
        <div className="max-w-md mx-auto px-6 mt-12 animate-in fade-in zoom-in duration-300">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
              <h2 className="text-2xl font-black text-white italic uppercase mb-6">{activeView} AKUN</h2>
              <div className="space-y-4">
                 <input 
                    type="text" 
                    placeholder="Username" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all" 
                 />
                 <input 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all" 
                 />
                 {activeView === 'REGISTER' && (
                    <input 
                      type="text" 
                      placeholder="Nomor Rekening/E-Wallet" 
                      className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500" 
                    />
                 )}
                 <button 
                    onClick={() => handleAuth(activeView)}
                    className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest mt-4 active:scale-95 transition-transform"
                 >
                    {activeView === 'LOGIN' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
                 </button>
                 <button onClick={() => setActiveView('HOME')} className="text-[10px] text-slate-500 uppercase font-black block w-full mt-4">Kembali ke Beranda</button>
              </div>
           </div>
        </div>
      ) : activeView === 'DEPOSIT' || activeView === 'WITHDRAW' ? (
        <div className="max-w-2xl mx-auto px-6 mt-8">
           {/* Form Deposit/Withdraw tetap sama seperti sebelumnya */}
           <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <button onClick={() => setActiveView('HOME')} className="text-[10px] font-black text-slate-500 uppercase mb-4 block">← Batal</button>
              <h2 className="text-2xl font-black text-white italic uppercase mb-8">{activeView}</h2>
              <p className="text-center text-slate-400 font-bold italic">Formulir {activeView} Sedang Dimuat...</p>
              {/* [Tambahkan logika input saldo di sini seperti kode sebelumnya] */}
           </div>
        </div>
      ) : (
        <>
          {/* HOME VIEW: Banner, Jackpot, Filter, Games (Semua Visual Dipertahankan) */}
          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className={`w-full h-44 md:h-56 rounded-[2.5rem] p-8 relative overflow-hidden bg-gradient-to-br ${PROMOS[currentPromo].color} transition-all duration-1000 shadow-2xl border border-white/10`}>
              <div className="relative z-10 h-full flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase leading-none">{PROMOS[currentPromo].title}</h2>
                <p className="text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">{PROMOS[currentPromo].sub}</p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 border border-yellow-500/20 text-center shadow-2xl">
              <p className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.5em] mb-2">Global Jackpot</p>
              <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter">IDR {jackpot.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-8 flex gap-3">
             <button onClick={() => user ? setActiveView('DEPOSIT') : setActiveView('LOGIN')} className="flex-1 bg-emerald-600/10 border border-emerald-600/20 p-4 rounded-3xl text-center">
                <p className="text-xs font-black text-emerald-400 uppercase italic">Deposit</p>
             </button>
             <button onClick={() => user ? setActiveView('WITHDRAW') : setActiveView('LOGIN')} className="flex-1 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-3xl text-center">
                <p className="text-xs font-black text-yellow-500 uppercase italic">Withdraw</p>
             </button>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-10 overflow-x-auto no-scrollbar flex gap-2">
            {PROVIDERS.map(p => (
              <button key={p} onClick={() => setActiveTab(p)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all border ${activeTab === p ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg' : 'bg-slate-900 text-slate-400 border-white/5'}`}>{p}</button>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {filteredGames.map((game) => (
              <div key={game.id} onClick={() => { setIsLoading(true); setTimeout(() => { setSelectedGameUrl(game.demoUrl); setIsLoading(false); }, 1000); }} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-yellow-500/50 group-hover:-translate-y-2">
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-b from-slate-800 to-black group-hover:scale-110 transition-transform duration-700">{game.image}</div>
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-black/70 backdrop-blur-md">
                    <p className="text-[9px] font-black text-emerald-400 text-center uppercase tracking-widest">RTP {game.rtp}%</p>
                  </div>
                </div>
                <h4 className="mt-3 text-[10px] font-black text-center text-slate-400 uppercase truncate px-2">{game.name}</h4>
              </div>
            ))}
          </div>
        </>
      )}

      {/* OVERLAYS */}
      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="h-12 bg-slate-950 flex justify-between items-center px-6 border-b border-white/10">
            <p className="text-[10px] font-black text-yellow-500 uppercase italic">Nexus Slot Engine - {user ? 'REAL MODE' : 'DEMO MODE'}</p>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-4 py-1 rounded text-[10px] font-black uppercase">Close</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.5em] animate-pulse">Memproses...</p>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// --- RENDER ---
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<React.StrictMode><GameApp /></React.StrictMode>);
