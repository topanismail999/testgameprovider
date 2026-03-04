import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PEMAIN' | 'TRANSAKSI' | 'SISTEM' | 'GAME'>('DASHBOARD');
  const [players, setPlayers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [sysConfig, setSysConfig] = useState({
    headerName: "NEXUSHUB",
    accentColor: "#EAB308",
    bannerTitle: "BONUS NEW MEMBER 100%",
    bannerSub: "Berlaku untuk Semua Provider Slot",
    bannerImage: "" 
  });

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPass, setNewPass] = useState("");
  const [winRate, setWinRate] = useState(50);

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
        if (item.key === 'banner_image') configObj.bannerImage = item.value;
      });
      setSysConfig(configObj);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchSettings();
    
    const channel = supabase.channel('admin-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchSettings())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [fetchData, fetchSettings]);

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('assets').getPublicUrl(fileName);
      
      // Update DB Langsung dengan onConflict key
      const { error: dbError } = await supabase.from('settings').upsert(
        { key: 'banner_image', value: data.publicUrl },
        { onConflict: 'key' }
      );

      if (dbError) throw dbError;
      
      setSysConfig(prev => ({ ...prev, bannerImage: data.publicUrl }));
      alert("Banner Berhasil Diperbarui!");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateAppVisual = async () => {
    setIsLoading(true);
    const updates = [
      { key: 'header_name', value: sysConfig.headerName },
      { key: 'banner_title', value: sysConfig.bannerTitle },
      { key: 'banner_sub', value: sysConfig.bannerSub },
      { key: 'accent_color', value: sysConfig.accentColor }
    ];

    for (const item of updates) {
      await supabase.from('settings').upsert(item, { onConflict: 'key' });
    }
    setIsLoading(false);
    alert("Konfigurasi Sistem Diperbarui!");
  };

  const processTransaction = async (trx: any, status: 'SUCCESS' | 'REJECTED') => {
    if (status === 'SUCCESS' && trx.status === 'PENDING') {
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
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-8 hidden md:flex shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg text-xl">N</div>
          <h1 className="font-black text-slate-900 uppercase tracking-tighter text-xl">
            {sysConfig.headerName.slice(0,5)}<span className="text-slate-400">{sysConfig.headerName.slice(5)}</span>
          </h1>
        </div>
        <nav className="space-y-2 flex-1">
          {['DASHBOARD', 'PEMAIN', 'TRANSAKSI', 'GAME', 'SISTEM'].map((id: any) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'}`}>
              {id === 'DASHBOARD' ? '📊' : id === 'PEMAIN' ? '👥' : id === 'TRANSAKSI' ? '💳' : id === 'GAME' ? '🎰' : '🛠️'} {id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{activeTab}</h2>
        </header>

        {activeTab === 'SISTEM' && (
          <div className="grid md:grid-cols-2 gap-10">
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
                   <label className="text-[9px] font-black text-slate-400 uppercase">Banner Background</label>
                   <div className="relative group">
                      <div className="w-full h-32 bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                         {sysConfig.bannerImage ? (
                            <img src={sysConfig.bannerImage} className="w-full h-full object-cover" alt="Banner Preview" />
                         ) : (
                            <span className="text-[10px] font-bold text-slate-400 uppercase">No Image</span>
                         )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                      {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-black">UPLOADING...</div>}
                   </div>
                   <input type="text" placeholder="Banner Title" className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sysConfig.bannerTitle} onChange={(e) => setSysConfig({...sysConfig, bannerTitle: e.target.value})} />
                   <input type="text" placeholder="Banner Subtitle" className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" value={sysConfig.bannerSub} onChange={(e) => setSysConfig({...sysConfig, bannerSub: e.target.value})} />
                   <button onClick={updateAppVisual} disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">PUSH UPDATE</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'TRANSAKSI' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black uppercase">User</th>
                  <th className="p-6 text-[10px] font-black uppercase">Type</th>
                  <th className="p-6 text-[10px] font-black uppercase">Amount</th>
                  <th className="p-6 text-[10px] font-black uppercase">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(trx => (
                  <tr key={trx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold">{trx.username}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black ${trx.type === 'DEPOSIT' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>{trx.type}</span>
                    </td>
                    <td className="p-6 font-mono font-bold">IDR {trx.amount.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`text-[9px] font-black ${trx.status === 'SUCCESS' ? 'text-emerald-500' : trx.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-600 animate-pulse'}`}>{trx.status}</span>
                    </td>
                    <td className="p-6 flex gap-2">
                      {trx.status === 'PENDING' && (
                        <>
                          <button onClick={() => processTransaction(trx, 'SUCCESS')} className="p-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold">APPROVE</button>
                          <button onClick={() => processTransaction(trx, 'REJECTED')} className="p-2 bg-red-500 text-white rounded-lg text-[10px] font-bold">REJECT</button>
                        </>
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
