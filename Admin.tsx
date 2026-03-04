import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PEMAIN' | 'TRANSAKSI' | 'SISTEM' | 'ADMIN BANK'>('DASHBOARD');
  const [players, setPlayers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [adminBanks, setAdminBanks] = useState<any[]>([]);
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
  const [bankForm, setBankForm] = useState({ bank_name: '', account_number: '', holder_name: '' });

  const stats = {
    totalPlayers: players.length,
    totalBalance: players.reduce((acc, curr) => acc + (curr.balance || 0), 0),
    totalDeposit: transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'SUCCESS').reduce((acc, curr) => acc + (curr.amount || 0), 0),
    totalWithdraw: transactions.filter(t => t.type === 'WITHDRAW' && t.status === 'SUCCESS').reduce((acc, curr) => acc + (curr.amount || 0), 0),
    pendingTransactions: transactions.filter(t => t.status === 'PENDING').length
  };

  const fetchData = useCallback(async () => {
    const { data: pData } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    const { data: tData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    const { data: bData } = await supabase.from('admin_banks').select('*');
    if (pData) setPlayers(pData);
    if (tData) setTransactions(tData);
    if (bData) setAdminBanks(bData);
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
    const channel = supabase.channel('admin-db-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_banks' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchSettings())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData, fetchSettings]);

  const addAdminBank = async () => {
    if (!bankForm.bank_name || !bankForm.account_number) return alert("Lengkapi data!");
    await supabase.from('admin_banks').insert([bankForm]);
    setBankForm({ bank_name: '', account_number: '', holder_name: '' });
    fetchData();
  };

  const deleteAdminBank = async (id: number) => {
    await supabase.from('admin_banks').delete().eq('id', id);
    fetchData();
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

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileName = `banner-${Date.now()}.${file.name.split('.').pop()}`;
      await supabase.storage.from('assets').upload(fileName, file);
      const { data } = supabase.storage.from('assets').getPublicUrl(fileName);
      await supabase.from('settings').upsert({ key: 'banner_image', value: data.publicUrl }, { onConflict: 'key' });
      setSysConfig(prev => ({ ...prev, bannerImage: data.publicUrl }));
      alert("Banner Berhasil!");
    } catch (e: any) { alert(e.message); } finally { setUploading(false); }
  };

  const updateAppVisual = async () => {
    setIsLoading(true);
    const updates = [
      { key: 'header_name', value: sysConfig.headerName },
      { key: 'banner_title', value: sysConfig.bannerTitle },
      { key: 'banner_sub', value: sysConfig.bannerSub },
      { key: 'accent_color', value: sysConfig.accentColor }
    ];
    for (const item of updates) { await supabase.from('settings').upsert(item, { onConflict: 'key' }); }
    setIsLoading(false);
    alert("Visual Diperbarui!");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-8 hidden md:flex shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg text-xl">N</div>
          <h1 className="font-black text-slate-900 uppercase tracking-tighter text-xl">{sysConfig.headerName}</h1>
        </div>
        <nav className="space-y-2 flex-1">
          {['DASHBOARD', 'PEMAIN', 'TRANSAKSI', 'ADMIN BANK', 'SISTEM'].map((id: any) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === id ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-50'}`}>
              {id === 'DASHBOARD' ? '📊' : id === 'PEMAIN' ? '👥' : id === 'TRANSAKSI' ? '💳' : id === 'ADMIN BANK' ? '🏦' : '🛠️'} {id}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{activeTab}</h2>
        </header>

        {activeTab === 'DASHBOARD' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pemain</p>
                <h3 className="text-3xl font-black text-slate-900">{stats.totalPlayers}</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Saldo Player</p>
                <h3 className="text-3xl font-black text-emerald-600">IDR {stats.totalBalance.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Deposit</p>
                <h3 className="text-3xl font-black text-blue-600">IDR {stats.totalDeposit.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Withdraw</p>
                <h3 className="text-3xl font-black text-orange-600">IDR {stats.totalWithdraw.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ADMIN BANK' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
               <h4 className="text-[11px] font-black uppercase mb-6">Tambah Bank Admin (Tujuan Deposit)</h4>
               <div className="grid md:grid-cols-4 gap-4">
                  <input type="text" placeholder="Nama Bank (e.g BCA)" className="bg-slate-50 p-4 rounded-xl font-bold uppercase" value={bankForm.bank_name} onChange={e => setBankForm({...bankForm, bank_name: e.target.value.toUpperCase()})} />
                  <input type="text" placeholder="Nomor Rekening" className="bg-slate-50 p-4 rounded-xl font-bold" value={bankForm.account_number} onChange={e => setBankForm({...bankForm, account_number: e.target.value})} />
                  <input type="text" placeholder="Nama Pemilik" className="bg-slate-50 p-4 rounded-xl font-bold uppercase" value={bankForm.holder_name} onChange={e => setBankForm({...bankForm, holder_name: e.target.value.toUpperCase()})} />
                  <button onClick={addAdminBank} className="bg-slate-900 text-white rounded-xl font-black uppercase text-[10px]">Tambah Bank</button>
               </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {adminBanks.map(b => (
                <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-100 relative group">
                  <button onClick={() => deleteAdminBank(b.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  <p className="text-[10px] font-black text-slate-400 uppercase">{b.bank_name}</p>
                  <p className="text-lg font-black mt-1">{b.account_number}</p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase mt-2">A/N {b.holder_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PEMAIN' && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map(p => (
                   <div key={p.username} onClick={() => {setSelectedUser(p); setWinRate(p.win_rate)}} className={`p-6 rounded-3xl border transition-all cursor-pointer ${selectedUser?.username === p.username ? 'border-slate-900 bg-slate-50' : 'border-slate-100'}`}>
                      <p className="text-[10px] font-black uppercase text-slate-400">Pemain</p>
                      <p className="font-black text-lg">{p.username}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">{p.bank_name} - {p.account_number}</p>
                      <div className="flex justify-between mt-4">
                         <div>
                            <p className="text-[8px] font-black uppercase text-slate-400">Balance</p>
                            <p className="font-mono font-bold text-emerald-600">IDR {p.balance.toLocaleString()}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black uppercase text-slate-400">Win Rate</p>
                            <p className="font-mono font-bold text-blue-600">{p.win_rate}%</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'TRANSAKSI' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
             <table className="w-full text-left text-xs">
                <thead>
                   <tr className="bg-slate-50 border-b border-slate-100 font-black uppercase text-[9px]">
                      <th className="p-6">User / Rekening</th>
                      <th className="p-6">Tipe</th>
                      <th className="p-6">Amount</th>
                      <th className="p-6">Status</th>
                      <th className="p-6 text-right">Action</th>
                </tr>
                </thead>
                <tbody>
                   {transactions.map(trx => {
                     const p = players.find(u => u.username === trx.username);
                     return (
                      <tr key={trx.id} className="border-b border-slate-50">
                         <td className="p-6">
                            <p className="font-black">{trx.username}</p>
                            <p className="text-[9px] text-slate-400 uppercase">{p?.bank_name} - {p?.account_number}</p>
                         </td>
                         <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black ${trx.type === 'DEPOSIT' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>{trx.type}</span>
                         </td>
                         <td className="p-6 font-mono font-bold">IDR {trx.amount.toLocaleString()}</td>
                         <td className="p-6">
                            <span className={`text-[9px] font-black ${trx.status === 'SUCCESS' ? 'text-emerald-500' : trx.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-600'}`}>{trx.status}</span>
                            {trx.note && <p className="text-[8px] italic text-slate-400 mt-1">{trx.note}</p>}
                         </td>
                         <td className="p-6 text-right">
                            {trx.status === 'PENDING' && (
                               <div className="flex justify-end gap-2">
                                  <button onClick={() => processTransaction(trx, 'SUCCESS')} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase">Approve</button>
                                  <button onClick={() => processTransaction(trx, 'REJECTED')} className="bg-red-500 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase">Reject</button>
                               </div>
                            )}
                         </td>
                      </tr>
                   )})}
                </tbody>
             </table>
          </div>
        )}
      </main>
    </div>
  );
}
