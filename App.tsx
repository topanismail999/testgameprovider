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
  { id: 1, color: "from-indigo-600 to-blue-900" },
  { id: 2, color: "from-red-600 to-rose-950" },
];

export default function App() {
  const [activeView, setActiveView] = useState<'HOME' | 'LOGIN' | 'REGISTER' | 'DEPOSIT' | 'WITHDRAW'>('HOME');
  const [user, setUser] = useState<{username: string, balance: number, win_rate?: number} | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [jackpot, setJackpot] = useState(8234567890);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', amount: '' });

  // STATE DINAMIS DARI ADMIN
  const [config, setConfig] = useState({
    headerName: 'NEXUSHUB',
    bannerTitle: 'BONUS NEW MEMBER 100%',
    bannerSub: 'Berlaku untuk Semua Provider Slot'
  });

  useEffect(() => {
    // 1. Ambil Konfigurasi dari Admin
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*');
      if (data) {
        const newConfig = { ...config };
        data.forEach(item => {
          if (item.key === 'header_name') newConfig.headerName = item.value;
          if (item.key === 'banner_title') newConfig.bannerTitle = item.value;
          if (item.key === 'banner_sub') newConfig.bannerSub = item.value;
        });
        setConfig(newConfig);
      }
    };
    fetchSettings();

    // 2. Realtime Settings Listener
    const settingsChannel = supabase.channel('realtime-settings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, () => fetchSettings())
      .subscribe();

    // 3. Auth Session
    const checkSession = async () => {
      const saved = localStorage.getItem('nexus_session');
      if (saved) {
        const { data } = await supabase.from('players').select('*').eq('username', saved).single();
        if (data) setUser(data);
      }
    };
    checkSession();

    // 4. Timers & Global Realtime
    const pTimer = setInterval(() => setCurrentPromo(p => (p + 1) % PROMOS.length), 5000);
    const jTimer = setInterval(() => setJackpot(prev => prev + Math.floor(Math.random() * 5000)), 2000);
    
    const clientChannel = supabase.channel('realtime-client')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload: any) => {
        if (user && payload.new.username === user.username) setUser(payload.new);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        if (user) fetchHistory(user.username);
      })
      .subscribe();

    if (user) fetchHistory(user.username);

    return () => { 
      clearInterval(pTimer); 
      clearInterval(jTimer); 
      supabase.removeChannel(settingsChannel); 
      supabase.removeChannel(clientChannel);
    };
  }, [user?.username]);

  const fetchHistory = async (username: string) => {
    const { data } = await supabase.from('transactions')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setHistory(data);
  };

  const handleAuth = async (type: 'LOGIN' | 'REGISTER') => {
    setIsLoading(true);
    if (type === 'REGISTER') {
      const { error } = await supabase.from('players').insert([{ username: formData.username, password: formData.password, balance: 0 }]);
      if (error) alert("Gagal Daftar!"); else alert("Berhasil! Silakan Login.");
    } else {
      const { data } = await supabase.from('players').select('*').eq('username', formData.username).eq('password', formData.password).single();
      if (data) { 
        setUser(data); 
        localStorage.setItem('nexus_session', data.username); 
        fetchHistory(data.username);
        setActiveView('HOME'); 
      } else alert("Login Gagal!");
    }
    setIsLoading(false);
  };

  const handleTransaction = async () => {
    if (!user || !formData.amount || Number(formData.amount) < 25000) return alert("Minimal nominal IDR 25,000!");
    setIsLoading(true);
    const { error } = await supabase.from('transactions').insert([
      { username: user.username, type: activeView, amount: Number(formData.amount), status: 'PENDING' }
    ]);
    setIsLoading(false);
    if (error) alert("Gagal: " + error.message);
    else {
      alert(`Permintaan ${activeView} Berhasil Dikirim!`);
      setFormData({ ...formData, amount: '' });
      fetchHistory(user.username);
      setActiveView('HOME');
    }
  };

  const filteredGames = activeTab === "ALL" ? GAMES : GAMES.filter(g => g.provider === activeTab);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32 overflow-x-hidden selection:bg-yellow-500">
      
      {/* RUNNING TEXT */}
      <div className="bg-yellow-500 text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-yellow-600 text-[10px] font-black uppercase tracking-widest">
        <div className="animate-marquee inline-block">GATES OF OLYMPUS 1000 GACOR PARAH ● DEPOSIT QRIS OTOMATIS ● WD TANPA RIBET ● HUBUNGI CS JIKA ADA KENDALA ●</div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('HOME')}>
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            {config.headerName[0]}
          </div>
          <h1 className="font-black text-white italic uppercase tracking-tighter text-xl">
            {config.headerName.includes('HUB') ? config.headerName.split('HUB')[0] : config.headerName}
            <span className="text-yellow-500 not-italic">{config.headerName.includes('HUB') ? 'HUB' : ''}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowHistory(true)} className="w-10 h-10 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-all shadow-inner">🕒</button>
              <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10 hidden md:block text-center shadow-inner">
                <p className="text-[8px] text-slate-500 font-black uppercase">ID: {user.username}</p>
                <p className="text-sm font-black text-emerald-400 font-mono italic tracking-tighter">IDR {user.balance.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => { localStorage.removeItem('nexus_session'); setUser(null); setHistory([]); }} className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setActiveView('LOGIN')} className="text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Masuk</button>
              <button onClick={() => setActiveView('REGISTER')} className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-[0_0_15px_rgba(234,179,8,0.4)]">Daftar</button>
            </div>
          )}
        </div>
      </nav>

      {/* TRANSACTION HISTORY SIDEBAR */}
      <div className={`fixed inset-y-0 right-0 z-[120] w-80 bg-slate-900 border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-in-out backdrop-blur-2xl bg-opacity-95 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Transaction History</h3>
               <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white font-black">✕</button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
               {history.length === 0 ? (
                  <div className="text-center py-20 opacity-20">
                     <p className="text-4xl mb-4">📜</p>
                     <p className="text-[10px] font-black uppercase tracking-widest">No Records Found</p>
                  </div>
               ) : (
                  history.map(trx => (
                     <div key={trx.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 relative group overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${trx.status === 'SUCCESS' ? 'bg-emerald-500' : trx.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-600'}`}></div>
                        <div className="flex justify-between items-start mb-2">
                           <p className={`text-[10px] font-black uppercase ${trx.type === 'DEPOSIT' ? 'text-blue-400' : 'text-orange-400'}`}>{trx.type}</p>
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${trx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : trx.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500 animate-pulse'}`}>{trx.status}</span>
                        </div>
                        <p className="text-sm font-black text-white font-mono tracking-tighter italic">IDR {trx.amount.toLocaleString()}</p>
                        <p className="text-[8px] text-slate-500 mt-1 uppercase font-bold">{new Date(trx.created_at).toLocaleString()}</p>
                     </div>
                  ))
               )}
            </div>
            <div className="pt-6 border-t border-white/5">
               <button onClick={() => setShowHistory(false)} className="w-full bg-slate-800 py-3 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">Close History</button>
            </div>
         </div>
      </div>

      {showHistory && <div onClick={() => setShowHistory(false)} className="fixed inset-0 z-[115] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"></div>}

      {/* VIEW CONTROLLER */}
      {activeView === 'LOGIN' || activeView === 'REGISTER' ? (
        <div className="max-w-md mx-auto px-6 mt-12 animate-in fade-in zoom-in duration-300">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
              <h2 className="text-2xl font-black text-white italic uppercase mb-6 tracking-tighter">{activeView} AKUN</h2>
              <div className="space-y-4">
                 <input type="text" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all text-center text-white" />
                 <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all text-center text-white" />
                 <button onClick={() => handleAuth(activeView)} className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest mt-4 active:scale-95 transition-transform shadow-lg">Konfirmasi</button>
                 <button onClick={() => setActiveView('HOME')} className="text-[10px] text-slate-500 uppercase font-black block w-full mt-4">Kembali ke Beranda</button>
              </div>
           </div>
        </div>
      ) : activeView === 'DEPOSIT' || activeView === 'WITHDRAW' ? (
        <div className="max-w-md mx-auto px-6 mt-8 animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center">
              <h2 className="text-2xl font-black text-white italic uppercase mb-2 tracking-tighter">{activeView} SALDO</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-8 italic">ID: {user?.username}</p>
              <div className="space-y-6">
                 <div className="bg-black/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Masukkan Nominal</p>
                    <input type="number" placeholder="Min. 25.000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-transparent text-center text-3xl font-black text-yellow-500 outline-none" />
                 </div>
                 <button onClick={handleTransaction} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl">Kirim Permintaan</button>
                 <button onClick={() => setActiveView('HOME')} className="text-[10px] text-slate-500 font-black uppercase">Batal & Kembali</button>
              </div>
           </div>
        </div>
      ) : (
        <>
          {/* BANNER PROMO DARI ADMIN */}
          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className={`w-full h-44 md:h-56 rounded-[2.5rem] p-8 relative overflow-hidden bg-gradient-to-br ${PROMOS[currentPromo].color} transition-all duration-1000 shadow-2xl border border-white/10`}>
              <div className="relative z-10 h-full flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase leading-none drop-shadow-lg">{config.bannerTitle}</h2>
                <p className="text-sm text-white/70 mt-2 font-bold uppercase tracking-widest">{config.bannerSub}</p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 border border-yellow-500/20 text-center shadow-2xl">
              <p className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.5em] mb-2 opacity-70">Global Jackpot</p>
              <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">IDR {jackpot.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-8 flex gap-3">
             <button onClick={() => user ? setActiveView('DEPOSIT') : setActiveView('LOGIN')} className="flex-1 bg-emerald-600/10 border border-emerald-600/20 p-4 rounded-3xl text-center group hover:bg-emerald-600/20 transition-all">
                <p className="text-xs font-black text-emerald-400 uppercase italic group-hover:scale-110 transition-transform">Deposit</p>
             </button>
             <button onClick={() => user ? setActiveView('WITHDRAW') : setActiveView('LOGIN')} className="flex-1 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-3xl text-center group hover:bg-yellow-500/20 transition-all">
                <p className="text-xs font-black text-yellow-500 uppercase italic group-hover:scale-110 transition-transform">Withdraw</p>
             </button>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-10 overflow-x-auto no-scrollbar flex gap-2">
            {PROVIDERS.map(p => (
              <button key={p} onClick={() => setActiveTab(p)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all border ${activeTab === p ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg scale-105' : 'bg-slate-900 text-slate-400 border-white/5'}`}>{p}</button>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {filteredGames.map((game) => (
              <div key={game.id} onClick={() => { setIsLoading(true); setTimeout(() => { setSelectedGameUrl(game.demoUrl); setIsLoading(false); }, 1000); }} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-yellow-500/50 group-hover:-translate-y-2 shadow-xl shadow-black/50">
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-b from-slate-800 to-black group-hover:scale-110 transition-transform duration-700">{game.image}</div>
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-black/70 backdrop-blur-md border-t border-white/5">
                    <p className="text-[9px] font-black text-emerald-400 text-center uppercase tracking-widest">RTP {game.rtp}%</p>
                  </div>
                  <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                </div>
                <h4 className="mt-3 text-[10px] font-black text-center text-slate-400 uppercase truncate px-2">{game.name}</h4>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="h-12 bg-slate-950 flex justify-between items-center px-6 border-b border-white/10">
            <p className="text-[10px] font-black text-yellow-500 uppercase italic">Nexus Slot Engine - {user ? 'REAL MODE' : 'DEMO MODE'}</p>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-4 py-1 rounded text-[10px] font-black uppercase shadow-lg">Close Game</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen title="Slot Game" />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
          <p className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.5em] animate-pulse">Menghubungkan Ke Server...</p>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
