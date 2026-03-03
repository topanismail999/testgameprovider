import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PEMAIN' | 'TRANSAKSI' | 'SISTEM' | 'GAME'>('DASHBOARD');
  const [players, setPlayers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [sysConfig, setSysConfig] = useState({
    headerName: "NEXUSHUB",
    accentColor: "#EAB308",
    bannerTitle: "BONUS NEW MEMBER 100%",
    bannerSub: "Berlaku untuk Semua Provider Slot"
  });

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPass, setNewPass] = useState("");
  const [winRate, setWinRate] = useState(50);

  // Fungsi Fetch Data (Gunakan useCallback agar bisa dipanggil di dalam useEffect)
  const fetchData = useCallback(async () => {
    const { data: pData } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    const { data: tData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (pData) setPlayers(pData);
    if (tData) setTransactions(tData);
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from('settings').select('*');
    if (data) {
      const configObj = { ...sysConfig };
      data.forEach(item => {
        if (item.key === 'header_name') configObj.headerName = item.value;
        if (item.key === 'banner_title') configObj.bannerTitle = item.value;
        if (item.key === 'banner_sub') configObj.bannerSub = item.value;
        if (item.key === 'accent_color') configObj.accentColor = item.value;
      });
      setSysConfig(configObj);
    }
  }, [sysConfig]);

  useEffect(() => {
    fetchData();
    fetchSettings();
    
    // PERBAIKAN: Listener Real-time yang lebih agresif untuk Transaksi & Pemain
    const channel = supabase.channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        console.log('Update Transaksi Terdeteksi:', payload);
        fetchData(); // Refresh data otomatis saat ada deposit baru/perubahan status
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        fetchData(); // Refresh data otomatis saat saldo/winrate berubah
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        fetchSettings();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [fetchData, fetchSettings]);

  // FUNGSI: Push Update Visual
  const updateAppVisual = async () => {
    setIsLoading(true);
    const updates = [
      { key: 'header_name', value: sysConfig.headerName },
      { key: 'banner_title', value: sysConfig.bannerTitle },
      { key: 'banner_sub', value: sysConfig.bannerSub },
      { key: 'accent_color', value: sysConfig.accentColor }
    ];

    for (const item of updates) {
      await supabase.from('settings').update({ value: item.value }).eq('key', item.key);
    }
    setIsLoading(false);
    alert("Visual Web Berhasil Diperbarui!");
  };

  // FUNGSI: Update Player (Win Rate & Password)
  const updatePlayerSettings = async () => {
    if (!selectedUser) return alert("Pilih pemain dulu!");
    setIsLoading(true);
    const updates: any = { win_rate: winRate };
    if (newPass) updates.password = newPass;

    const { error } = await supabase.from('players').update(updates).eq('username', selectedUser.username);
    setIsLoading(false);
    if (!error) {
      alert(`User ${selectedUser.username} Updated! Win Rate: ${winRate}%`);
      setNewPass("");
    }
  };

  // FUNGSI: Proses Transaksi (Deposit/WD)
  const processTransaction = async (trx: any, status: 'SUCCESS' | 'REJECTED') => {
    if (status === 'SUCCESS') {
      const player = players.find(p => p.username === trx.username);
      if (player) {
        let newBal = trx.type === 'DEPOSIT' ? player.balance + trx.amount : player.balance - trx.amount;
        if (newBal < 0) return alert("Saldo tidak cukup!");
        await supabase.from('players').update({ balance: newBal }).eq('username', trx.username);
      }
    }
    await supabase.from('transactions').update({ status }).eq('id', trx.id);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-8 hidden md:flex shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg text-xl">N</div>
          <h1 className="font-black text-slate-900 uppercase tracking-tighter text-xl">
            {sysConfig.headerName.slice(0,5)}<span className="text-slate-400">{sysConfig.headerName.slice(5)}</span>
          </h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'DASHBOARD', icon: '📊', label: 'Overview' },
            { id: 'PEMAIN', icon: '👥', label: 'User Control' },
            { id: 'TRANSAKSI', icon: '💳', label: 'Finance' },
            { id: 'GAME', icon: '🎰', label: 'Game Engine' },
            { id: 'SISTEM', icon: '🛠️', label: 'App Settings' }
          ].map((item: any) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{activeTab}</h2>
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Master Server Active</p>
           </div>
        </header>

        {/* TAB SISTEM */}
        {activeTab === 'SISTEM' && (
          <div className="grid md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
                <h4 className="text-[11px] font-black uppercase border-l-4 border-slate-900 pl-4 mb-8">Visual & Identity</h4>
                <div className="space-y-4">
                   <label className="text-[9px] font-black text-slate-400 uppercase">App Name</label>
                   <input type="text" className="w-full bg-slate-50 border p-4 rounded-2xl font-bold uppercase" value={sysConfig.headerName} onChange={(e) => setSysConfig({...sysConfig, headerName: e.target.value.toUpperCase()})} />
                   <label className="text-[9px] font-black text-slate-400 uppercase">Accent Color</label>
                   <input type="color" className="h-14 w-full rounded-xl cursor-pointer" value={sysConfig.accentColor} onChange={(e) => setSysConfig({...sysConfig, accentColor: e.target.value})} />
                </div>
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
                <h4 className="text-[11px] font-black uppercase border-l-4 border-slate-900 pl-4 mb-8">Promo Manager</h4>
                <div className="space-y-4">
                   <input type="text" className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sysConfig.bannerTitle} onChange={(e) => setSysConfig({...sysConfig, bannerTitle: e.target.value})} />
                   <input type="text" className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sysConfig.bannerSub} onChange={(e) => setSysConfig({...sysConfig, bannerSub: e.target.value})} />
                   <button onClick={updateAppVisual} disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">PUSH UPDATE</button>
                </div>
             </div>
          </div>
        )}

        {/* TAB PEMAIN */}
        {activeTab === 'PEMAIN' && (
           <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                 <h4 className="text-[11px] font-black uppercase mb-8 text-yellow-500">Player Intelligence</h4>
                 <div className="grid md:grid-cols-4 gap-6 items-end">
                    <select className="bg-white/10 border-none p-4 rounded-2xl font-bold text-xs text-white" onChange={(e) => setSelectedUser(players.find(p => p.username === e.target.value))}>
                       <option value="" className="text-black">Pilih Pemain</option>
                       {players.map(p => <option key={p.id} value={p.username} className="text-black">{p.username}</option>)}
                    </select>
                    <input type="text" placeholder="Password Baru" className="bg-white/10 border-none p-4 rounded-2xl text-xs text-white" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                    <div className="bg-white/5 p-4 rounded-2xl">
                       <p className="text-[8px] font-black uppercase text-yellow-500 mb-2">Win Rate: {winRate}%</p>
                       <input type="range" min="1" max="100" value={winRate} onChange={(e) => setWinRate(Number(e.target.value))} className="w-full accent-yellow-500" />
                    </div>
                    <button onClick={updatePlayerSettings} className="bg-yellow-500 text-black h-[52px] rounded-2xl font-black uppercase text-[10px]">APPLY SETTINGS</button>
                 </div>
              </div>
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <tr><th className="p-8">Player</th><th className="p-8">Balance</th><th className="p-8">Win Rate</th><th className="p-8">Password</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-sm">
                       {players.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-all">
                             <td className="p-8">{p.username}</td>
                             <td className="p-8 text-emerald-600 font-mono">IDR {p.balance.toLocaleString()}</td>
                             <td className="p-8"><span className="px-3 py-1 bg-slate-100 rounded-full text-[10px]">{p.win_rate || 50}%</span></td>
                             <td className="p-8 text-slate-300 font-mono text-xs">{p.password}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* TAB TRANSAKSI (Otomatis Update!) */}
        {activeTab === 'TRANSAKSI' && (
           <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr><th className="p-8">User</th><th className="p-8">Type</th><th className="p-8">Amount</th><th className="p-8">Status</th><th className="p-8 text-right">Action</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {transactions.map(t => (
                       <tr key={t.id} className="font-bold text-sm hover:bg-slate-50">
                          <td className="p-8">{t.username}</td>
                          <td className="p-8"><span className={`text-[9px] px-2 py-1 rounded-md ${t.type === 'DEPOSIT' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>{t.type}</span></td>
                          <td className="p-8 font-mono">IDR {t.amount.toLocaleString()}</td>
                          <td className="p-8 text-[10px] font-black uppercase">
                             <span className={t.status === 'SUCCESS' ? 'text-emerald-500' : t.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-600 animate-pulse'}>{t.status}</span>
                          </td>
                          <td className="p-8 text-right">
                             {t.status === 'PENDING' && (
                                <div className="flex gap-2 justify-end">
                                   <button onClick={() => processTransaction(t, 'SUCCESS')} className="bg-emerald-500 text-white p-2 rounded-xl text-[9px] px-4">APPROVE</button>
                                   <button onClick={() => processTransaction(t, 'REJECTED')} className="bg-red-500 text-white p-2 rounded-xl text-[9px] px-4">REJECT</button>
                                </div>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}
      </main>
    </div>
  );
}
