import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const PROVIDERS = ["ALL", "PRAGMATIC", "PG SOFT", "HABANERO", "PLAY'N GO", "SPADEGAMING", "CQ9", "JOKER", "BETSOFT", "NETENT"];

const GAMES = [
  { id: 'vs20olympgate', name: 'Gates of Olympus', provider: 'PRAGMATIC', image: 'https://lh3.googleusercontent.com/d/1CBo5CmOLpgRE4DMomoMnH9xt3ceSkyB9', rtp: 98.5, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=en&cur=IDR' },
  { id: 'vs20starlight', name: 'Starlight Princess', provider: 'PRAGMATIC', image: 'https://lh3.googleusercontent.com/d/1ka_74DGK4T2hCgotjWAYM6t_seA1KpmQ', rtp: 96.2, demoUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20starlight&lang=en&cur=IDR' },
  { id: 'mahjong-ways-2', name: 'Mahjong Ways 2', provider: 'PG SOFT', image: 'https://lh3.googleusercontent.com/d/1mU1Hjt1zX6ZdX9LR4KxKVkX0cJO3PQ4P', rtp: 97.1, demoUrl: 'https://m.pgsoft-games.com/126/index.html' },
  { id: 'lucky-neko', name: 'Lucky Neko', provider: 'PG SOFT', image: 'https://lh3.googleusercontent.com/d/1yX4r5AyxtAnMBXnrLn_FdUYSDw1wNAae', rtp: 96.7, demoUrl: 'https://m.pgsoft-games.com/125/index.html' },
  { id: 'koigate', name: 'Koi Gate', provider: 'HABANERO', image: 'https://lh3.googleusercontent.com/d/1iqfb47e0jeaAPUSvHRnGsmkOrkFkkhtu', rtp: 98.2, demoUrl: 'https://demo-pff.hanabero.com/koi-gate' },
  { id: 'book-of-dead', name: 'Book of Dead', provider: "PLAY'N GO", image: 'https://lh3.googleusercontent.com/d/1oGBNf9yayXTaElyRvBpwb_XCT21Qnd3p', rtp: 96.2, demoUrl: 'https://www.playngo.com/games/book-of-dead' },
  { id: 'brothers-kingdom', name: 'Brothers Kingdom', provider: 'SPADEGAMING', image: 'https://lh3.googleusercontent.com/d/1QIXTkNy81kNkATDbLRNtJJS65hmN-0ph', rtp: 97.0, demoUrl: 'https://demo.spadegaming.com/detail/brothers_kingdom' },
  { id: 'jump-high-2', name: 'Jump High 2', provider: 'CQ9', image: 'https://lh3.googleusercontent.com/d/1ynQaTvuJ18gWvmj3mwojSJ-mLg3n66uI', rtp: 96.0, demoUrl: 'https://demo.cq9gaming.com/' },
  { id: 'roma', name: 'Roma', provider: 'JOKER', image: 'https://lh3.googleusercontent.com/d/1mER0QZ1NzBQQxeZrHxFlIKWAwZoo5wZe', rtp: 95.8, demoUrl: 'https://www.jokerapp666.com/game/roma' },
  { id: 'sugar-pop-2', name: 'Sugar Pop 2', provider: 'BETSOFT', image: 'https://lh3.googleusercontent.com/d/1B23sQQ7yetsivlxTz85bzsGQDQEVkOZd', rtp: 96.4, demoUrl: 'https://betsoft.com/games/sugar-pop-2/' },
  { id: 'starburst', name: 'Starburst', provider: 'NETENT', image: 'https://lh3.googleusercontent.com/d/1HDX2RGKSaH5KXN-RsfphvobeAN4laKCH', rtp: 96.1, demoUrl: 'https://games.netent.com/video-slots/starburst/' },
];

const BANK_LIST = ["BCA", "BNI", "BRI", "MANDIRI", "DANA", "OVO", "GOPAY"];

export default function App() {
  const [activeView, setActiveView] = useState<'HOME' | 'LOGIN' | 'REGISTER' | 'DEPOSIT' | 'WITHDRAW'>('HOME');
  const [user, setUser] = useState<{username: string, balance: number, win_rate?: number, bank_name?: string, account_number?: string} | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [latestDeposits, setLatestDeposits] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [jackpot, setJackpot] = useState(8234567890);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedGameUrl, setSelectedGameUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', amount: '', bank_name: 'BCA', account_number: '', target_bank: '' });
  const [adminBanks, setAdminBanks] = useState<any[]>([]);

  const [config, setConfig] = useState({
    headerName: 'ELCYQQ',
    bannerTitle: 'BONUS NEW MEMBER 100%',
    bannerSub: 'Berlaku untuk Semua Provider Slot',
    bannerImages: [] as string[]
  });

  const fetchSettings = async () => {
    const { data: settings } = await supabase.from('settings').select('*');
    if (settings) {
      const newConfig: any = { ...config, bannerImages: [] };
      const imgs = ["", "", ""];
      settings.forEach(item => {
        if (item.key === 'header_name') newConfig.headerName = item.value;
        if (item.key === 'banner_title') newConfig.bannerTitle = item.value;
        if (item.key === 'banner_sub') newConfig.bannerSub = item.value;
        if (item.key === 'banner_image_1') imgs[0] = item.value;
        if (item.key === 'banner_image_2') imgs[1] = item.value;
        if (item.key === 'banner_image_3') imgs[2] = item.value;
      });
      newConfig.bannerImages = imgs.filter(i => i !== "");
      setConfig(newConfig);
    }
    const { data: banks } = await supabase.from('admin_banks').select('*');
    if (banks) {
      setAdminBanks(banks);
      if (banks.length > 0) setFormData(prev => ({...prev, target_bank: `${banks[0].bank_name} - ${banks[0].account_number}`}));
    }
  };

  const fetchRunningTextData = async () => {
    const { data } = await supabase.from('transactions').select('username, amount').eq('status', 'SUCCESS').eq('type', 'DEPOSIT').order('created_at', { ascending: false }).limit(10);
    if (data) setLatestDeposits(data);
  };

  const fetchUser = async (username: string) => {
    const { data } = await supabase.from('players').select('*').eq('username', username).single();
    if (data) setUser(data);
  };

  const fetchHistory = async (username: string) => {
    const { data } = await supabase.from('transactions').select('*').eq('username', username).order('created_at', { ascending: false }).limit(10);
    if (data) setHistory(data);
  };

  useEffect(() => {
    fetchSettings();
    fetchRunningTextData();
    const saved = localStorage.getItem('nexus_session');
    if (saved) fetchUser(saved);

    const jTimer = setInterval(() => setJackpot(prev => prev + Math.floor(Math.random() * 5000)), 2000);

    const settingsChannel = supabase.channel('realtime-settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchSettings())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_banks' }, () => fetchSettings())
      .subscribe();

    const clientChannel = supabase.channel('realtime-client')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players' }, (payload: any) => {
        const currentSession = localStorage.getItem('nexus_session');
        if (payload.new.username === currentSession) setUser(payload.new);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload: any) => {
        const currentSession = localStorage.getItem('nexus_session');
        fetchRunningTextData();
        if (currentSession && (payload.new?.username === currentSession || payload.old?.username === currentSession)) fetchHistory(currentSession);
      })
      .subscribe();

    return () => { 
      clearInterval(jTimer); 
      supabase.removeChannel(settingsChannel); 
      supabase.removeChannel(clientChannel);
    };
  }, []);

  // Slide Effect
  useEffect(() => {
    if (config.bannerImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % config.bannerImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [config.bannerImages]);

  const handleAuth = async (type: 'LOGIN' | 'REGISTER') => {
    setIsLoading(true);
    if (type === 'REGISTER') {
      const { error } = await supabase.from('players').insert([{ 
        username: formData.username, password: formData.password, bank_name: formData.bank_name, account_number: formData.account_number, balance: 0, win_rate: 50 
      }]);
      if (error) alert("Username sudah terpakai!"); else alert("Berhasil! Silakan Login.");
    } else {
      const { data } = await supabase.from('players').select('*').eq('username', formData.username).eq('password', formData.password).single();
      if (data) { 
        setUser(data); localStorage.setItem('nexus_session', data.username); fetchHistory(data.username); setActiveView('HOME'); 
      } else alert("Login Gagal!");
    }
    setIsLoading(false);
  };

  const handleTransaction = async () => {
    if (!user || !formData.amount || Number(formData.amount) < 25000) return alert("Minimal IDR 25,000!");
    setIsLoading(true);
    const note = activeView === 'DEPOSIT' ? `Ke: ${formData.target_bank}` : `Ke Rek: ${user.bank_name} ${user.account_number}`;
    const { error } = await supabase.from('transactions').insert([{ username: user.username, type: activeView, amount: Number(formData.amount), status: 'PENDING', note }]);
    setIsLoading(false);
    if (error) alert("Gagal: " + error.message);
    else { alert(`Permintaan ${activeView} Dikirim!`); setFormData({ ...formData, amount: '' }); setActiveView('HOME'); }
  };

  const openGame = (gameUrl: string) => {
    if (!user) { setActiveView('LOGIN'); return; }
    if (user.balance < 1000) { alert("Saldo anda tidak mencukupi!"); setActiveView('DEPOSIT'); return; }
    setIsLoading(true);
    setTimeout(() => { setSelectedGameUrl(gameUrl); setIsLoading(false); }, 1500);
  };

  const filteredGames = activeTab === "ALL" ? GAMES : GAMES.filter(g => g.provider === activeTab);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-32 overflow-x-hidden selection:bg-yellow-500">
      
      {/* RUNNING TEXT */}
      <div className="bg-yellow-500 text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-yellow-600 text-[10px] font-black uppercase tracking-widest">
        <div className="animate-marquee inline-block">
          SITUS RESMI {config.headerName} ● SETORAN TERAKHIR: 
          {latestDeposits.length > 0 ? latestDeposits.map((ld, i) => (
            <span key={i} className="ml-4">{ld.username.substring(0,3)}*** - IDR {ld.amount.toLocaleString()} ✅ ●</span>
          )) : " MEMPROSES TRANSAKSI... ● "}
          DEPOSIT QRIS OTOMATIS ● WD CEPAT ● WINRATE ADMIN AKTIF ●
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('HOME')}>
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-black text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]">{config.headerName[0]}</div>
          <h1 className="font-black text-white italic uppercase tracking-tighter text-xl">{config.headerName}</h1>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowHistory(true)} className="w-10 h-10 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-center text-slate-400">🕒</button>
              <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/10 hidden md:block text-center shadow-inner">
                <p className="text-[8px] text-slate-500 font-black uppercase">ID: {user.username}</p>
                <p className="text-sm font-black text-emerald-400 font-mono italic tracking-tighter">IDR {user.balance.toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => { localStorage.removeItem('nexus_session'); setUser(null); }} className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setActiveView('LOGIN')} className="text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Masuk</button>
              <button onClick={() => setActiveView('REGISTER')} className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase">Daftar</button>
            </div>
          )}
        </div>
      </nav>

      {/* BANNER SLIDER */}
      {activeView === 'HOME' && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="relative w-full h-44 md:h-64 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            {config.bannerImages.length > 0 ? (
              config.bannerImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  style={{ backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="absolute bottom-8 left-8">
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase drop-shadow-2xl">{config.bannerTitle}</h2>
                    <p className="text-sm text-yellow-500 mt-2 font-bold uppercase tracking-widest">{config.bannerSub}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center">
                 <h2 className="text-3xl font-black italic text-white/20 uppercase">{config.headerName}</h2>
              </div>
            )}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 right-8 z-20 flex gap-2">
              {config.bannerImages.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-yellow-500' : 'w-2 bg-white/30'}`}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form views (Login/Register/Depo/WD) tetap sama sesuai struktur App.tsx awal Anda */}
      {activeView === 'LOGIN' || activeView === 'REGISTER' ? (
        <div className="max-w-md mx-auto px-6 mt-12 animate-in fade-in zoom-in duration-300">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
              <h2 className="text-2xl font-black text-white italic uppercase mb-6 tracking-tighter">{activeView} AKUN</h2>
              <div className="space-y-4">
                 <input type="text" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-center text-white" />
                 <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-center text-white" />
                 {activeView === 'REGISTER' && (
                    <>
                    <select onChange={(e) => setFormData({...formData, bank_name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-white text-center font-black">
                        {BANK_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <input type="text" placeholder="Nomor Rekening" onChange={(e) => setFormData({...formData, account_number: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-center text-white" />
                    </>
                 )}
                 <button onClick={() => handleAuth(activeView)} className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest mt-4">Konfirmasi</button>
                 <button onClick={() => setActiveView('HOME')} className="text-[10px] text-slate-500 uppercase font-black block w-full mt-4">Kembali</button>
              </div>
           </div>
        </div>
      ) : activeView === 'DEPOSIT' || activeView === 'WITHDRAW' ? (
        <div className="max-w-md mx-auto px-6 mt-8 animate-in slide-in-from-bottom-10">
           <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center">
              <h2 className="text-2xl font-black text-white italic uppercase mb-8 tracking-tighter">{activeView} SALDO</h2>
              <div className="space-y-6 text-left">
                 {activeView === 'DEPOSIT' && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Pilih Bank Tujuan Deposit:</label>
                        <select onChange={(e) => setFormData({...formData, target_bank: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-yellow-500 font-bold">
                            {adminBanks.map(b => <option key={b.id} value={`${b.bank_name} - ${b.account_number}`}>{b.bank_name} ({b.account_number}) A/N {b.holder_name}</option>)}
                        </select>
                    </div>
                 )}
                 <div className="bg-black/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                    <input type="number" placeholder="Min. 25.000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-transparent text-center text-3xl font-black text-yellow-500 outline-none" />
                 </div>
                 <button onClick={handleTransaction} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em]">Kirim Permintaan</button>
                 <button onClick={() => setActiveView('HOME')} className="text-center text-[10px] text-slate-500 font-black uppercase w-full block">Batal</button>
              </div>
           </div>
        </div>
      ) : (
        <>
          {/* JACKPOT & GAMES */}
          <div className="max-w-7xl mx-auto px-6 mt-6">
            <div className="bg-gradient-to-b from-slate-900 to-black rounded-3xl p-6 border border-yellow-500/20 text-center shadow-2xl">
              <p className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.5em] mb-2 opacity-70">Global Jackpot</p>
              <h2 className="text-4xl md:text-6xl font-black text-white font-mono tracking-tighter italic">IDR {jackpot.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-8 flex gap-3">
             <button onClick={() => user ? setActiveView('DEPOSIT') : setActiveView('LOGIN')} className="flex-1 bg-emerald-600/10 border border-emerald-600/20 p-4 rounded-3xl text-center group hover:bg-emerald-600/20 transition-all">
                <p className="text-xs font-black text-emerald-400 uppercase italic">Deposit</p>
             </button>
             <button onClick={() => user ? setActiveView('WITHDRAW') : setActiveView('LOGIN')} className="flex-1 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-3xl text-center group hover:bg-yellow-500/20 transition-all">
                <p className="text-xs font-black text-yellow-500 uppercase italic">Withdraw</p>
             </button>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-10 overflow-x-auto no-scrollbar flex gap-2">
            {PROVIDERS.map(p => (
              <button key={p} onClick={() => setActiveTab(p)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase border whitespace-nowrap transition-all ${activeTab === p ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-slate-900 text-slate-400 border-white/5'}`}>{p}</button>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 font-black uppercase pb-10">
            {filteredGames.map((game) => (
              <div key={game.id} onClick={() => openGame(game.demoUrl)} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-yellow-500/50 group-hover:-translate-y-2 shadow-xl shadow-black/50">
                  <img src={game.image} alt={game.name} loading="lazy" onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/300x400/020617/yellow?text=SLOT'; }} className="w-full h-full object-cover brightness-90 group-hover:brightness-110 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black via-black/80 to-transparent text-center">
                    <p className="text-[9px] font-black text-emerald-400 uppercase">RTP {game.rtp}%</p>
                  </div>
                </div>
                <h4 className="mt-3 text-[10px] font-black text-center text-slate-400 uppercase truncate px-2 group-hover:text-yellow-500">{game.name}</h4>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODALS & HISTORY */}
      <div className={`fixed inset-y-0 right-0 z-[120] w-80 bg-slate-900 border-l border-white/10 shadow-2xl transform transition-transform duration-500 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xs font-black text-white uppercase italic">History</h3>
               <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white font-black">✕</button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
               {history.length > 0 ? history.map(trx => (
                  <div key={trx.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${trx.status === 'SUCCESS' ? 'bg-emerald-500' : trx.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-600'}`}></div>
                    <p className={`text-[10px] font-black uppercase ${trx.type === 'DEPOSIT' ? 'text-blue-400' : 'text-orange-400'}`}>{trx.type}</p>
                    <p className="text-sm font-black text-white font-mono italic">IDR {trx.amount.toLocaleString()}</p>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${trx.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{trx.status}</span>
                  </div>
               )) : <p className="text-center text-slate-500 text-[10px] font-bold">BELUM ADA TRANSAKSI</p>}
            </div>
          </div>
      </div>

      {selectedGameUrl && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="h-12 bg-slate-950 flex justify-between items-center px-6 border-b border-white/10">
            <p className="text-[10px] font-black text-yellow-500 uppercase italic">Winrate Engine: {user?.win_rate}% Active</p>
            <button onClick={() => setSelectedGameUrl(null)} className="bg-red-600 text-white px-4 py-1 rounded text-[10px] font-black uppercase">Exit</button>
          </div>
          <iframe src={selectedGameUrl} className="flex-1 w-full border-none" allowFullScreen />
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.5em] animate-pulse">Connecting Engine...</p>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
