import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const PROVIDERS = ["ALL", "PRAGMATIC", "PG SOFT", "HABANERO", "JOKER", "SPADEGAMING"];
const GAMES = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'PRAGMATIC', image: '⚡', rtp: 98.5, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=en&cur=IDR' },
  { id: 'mahjong-ways-2', name: 'Mahjong Ways 2', provider: 'PG SOFT', image: '🀄', rtp: 97.1, demoUrl: 'https://m.pgsoft-games.com/126/index.html' },
  { id: 'koigate', name: 'Koi Gate', provider: 'HABANERO', image: '🐟', rtp: 98.2, demoUrl: 'https://demo-pff.hanabero.com/koi-gate' },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'PRAGMATIC', image: '⭐', rtp: 96.2, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20starlight&lang=en&cur=IDR' },
];
const PROMOS = [
  { id: 1, title: "BONUS NEW MEMBER 100%", sub: "Berlaku untuk Semua Provider Slot", color: "from-indigo-600 to-blue-900" },
  { id: 2, title: "CASHBACK MINGGUAN 5%", sub: "Dibagikan Setiap Hari Selasa", color: "from-red-600 to-rose-950" },
];

export default function App() {
  const [activeView, setActiveView] = useState<'HOME' | 'LOGIN' | 'REGISTER' | 'DEPOSIT' | 'WITHDRAW'>('HOME');
  const [user, setUser] = useState<{username: string, balance: number} | null>(null);
  const [jackpot, setJackpot] = useState(8234567890);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  // Sinkronisasi User & Real-time Balance dari Supabase
  useEffect(() => {
    const checkSession = async () => {
      const saved = localStorage.getItem('nexus_session');
      if (saved) {
        const { data } = await supabase.from('players').select('*').eq('username', saved).single();
        if (data) setUser(data);
      }
    };
    checkSession();

    const pTimer = setInterval(() => setCurrentPromo(p => (p + 1) % PROMOS.length), 5000);
    const jTimer = setInterval(() => setJackpot(prev => prev + Math.floor(Math.random() * 5000)), 2000);
    
    // Listen to real-time changes
    const channel = supabase.channel('realtime-players').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players' }, (payload) => {
      if (user && payload.new.username === user.username) setUser(payload.new as any);
    }).subscribe();

    return () => { clearInterval(pTimer); clearInterval(jTimer); supabase.removeChannel(channel); };
  }, [user?.username]);

  const handleAuth = async (type: 'LOGIN' | 'REGISTER') => {
    setIsLoading(true);
    if (type === 'REGISTER') {
      const { error } = await supabase.from('players').insert([{ username: formData.username, password: formData.password, balance: 0 }]);
      if (error) alert("Gagal Daftar: " + error.message);
      else alert("Berhasil! Silakan Login.");
    } else {
      const { data } = await supabase.from('players').select('*').eq('username', formData.username).eq('password', formData.password).single();
      if (data) {
        setUser(data);
        localStorage.setItem('nexus_session', data.username);
        setActiveView('HOME');
      } else alert("Username/Password Salah");
    }
    setIsLoading(false);
  };

  const filteredGames = activeTab === "ALL" ? GAMES : GAMES.filter(g => g.provider === activeTab);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32 overflow-x-hidden">
      {/* RUNNING TEXT */}
      <div className="bg-yellow-500 text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-yellow-600 text-[10px] font-black uppercase">
        <div className="animate-marquee inline-block">GATES OF OLYMPUS 1000 GACOR PARAH ● DEPOSIT QRIS OTOMATIS ● WD TANPA RIBET ●</div>
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
               <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10 hidden md:block text-center">
                <p className="text-[8px] text-slate-500 font-black uppercase">ID: {user.username}</p>
                <p className="text-sm font-black text-emerald-400 font-mono italic">IDR {user.balance.toLocaleString()}</p>
              </div>
              <button onClick={() => { localStorage.removeItem('nexus_session'); setUser(null); }} className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => setActiveView('LOGIN')} className="text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Masuk</button>
              <button onClick={() => setActiveView('REGISTER')} className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase">Daftar</button>
            </>
          )}
        </div>
      </nav>

      {/* TAMPILAN LOGIN/REGISTER */}
      {(activeView === 'LOGIN' || activeView === 'REGISTER') && (
        <div className="max-w-md mx-auto px-6 mt-12 animate-in fade-in zoom-in duration-300">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-black text-white italic uppercase mb-6 text-center">{activeView}</h2>
              <div className="space-y-4">
                 <input type="text" placeholder="Username" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500" onChange={(e) => setFormData({...formData, username: e.target.value})} />
                 <input type="password" placeholder="Password" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                 <button onClick={() => handleAuth(activeView)} className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest mt-4">Kirim</button>
                 <button onClick={() => setActiveView('HOME')} className="text-[10px] text-slate-500 uppercase font-black block w-full text-center mt-4">Kembali</button>
              </div>
           </div>
        </div>
      )}

      {/* BERANDA UTAMA */}
      {activeView === 'HOME' && (
        <>
          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className={`w-full h-44 md:h-56 rounded-[2.5rem] p-8 relative overflow-hidden bg-gradient-to-br ${PROMOS[currentPromo].color} transition-all duration-1000 shadow-2xl border border-white/10`}>
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase leading-none">{PROMOS[currentPromo].title}</h2>
              <p className="text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">{PROMOS[currentPromo].sub}</p>
            </div>
            <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 border border-yellow-500/20 text-center shadow-2xl mt-6">
              <p className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.5em] mb-2">Global Jackpot</p>
              <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter italic">IDR {jackpot.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          {/* GRID GAMES */}
          <div className="max-w-7xl mx-auto px-6 mt-10">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
              {PROVIDERS.map(p => (
                <button key={p} onClick={() => setActiveTab(p)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase border ${activeTab === p ? 'bg-yellow-500 text-black' : 'bg-slate-900 text-slate-400 border-white/5'}`}>{p}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-6">
              {filteredGames.map((game) => (
                <div key={game.id} onClick={() => { setIsLoading(true); setTimeout(() => { setSelectedGameUrl(game.demoUrl); setIsLoading(false); }, 1000); }} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden group-hover:border-yellow-500/50 transition-all duration-500">
                    <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">{game.image}</div>
                    <div className="absolute bottom-0 w-full p-3 bg-black/70 backdrop-blur-md text-center"><p className="text-[9px] font-black text-emerald-400 uppercase">RTP {game.rtp}%</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* GAME IFRAME */}
      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="h-12 bg-slate-950 flex justify-between items-center px-6 border-b border-white/10">
            <p className="text-[10px] font-black text-yellow-500 uppercase italic">Live Game Session</p>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-4 py-1 rounded text-[10px] font-black uppercase">Close</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest animate-pulse">Memproses...</p>
        </div>
      )}
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 30s linear infinite; } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
