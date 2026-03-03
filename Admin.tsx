import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PEMAIN' | 'TRANSAKSI' | 'PENGATURAN'>('DASHBOARD');
  const [players, setPlayers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetchData();
    // Real-time listener untuk transaksi baru
    const sub = supabase.channel('admin-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchData = async () => {
    const { data: pData } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    const { data: tData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (pData) setPlayers(pData);
    if (tData) setTransactions(tData);
  };

  const processTransaction = async (trx: any, status: 'SUCCESS' | 'REJECTED') => {
    if (status === 'SUCCESS') {
      const player = players.find(p => p.username === trx.username);
      if (!player) return alert("Player tidak ditemukan");

      let newBalance = trx.type === 'DEPOSIT' 
        ? player.balance + trx.amount 
        : player.balance - trx.amount;

      if (newBalance < 0) return alert("Saldo tidak cukup untuk Withdraw ini!");

      // Update Saldo Player
      await supabase.from('players').update({ balance: newBalance }).eq('username', trx.username);
    }

    // Update Status Transaksi
    await supabase.from('transactions').update({ status }).eq('id', trx.id);
    
    // Simpan ke Log
    const log = { id: Date.now(), action: status, detail: `${trx.type} ${trx.username} - IDR ${trx.amount.toLocaleString()}`, time: new Date().toLocaleTimeString() };
    setLogs([log, ...logs]);
    fetchData();
  };

  const handleManualUpdate = async () => {
    if (!selectedUser) return alert("Pilih pemain!");
    await supabase.from('players').update({ balance: amount }).eq('username', selectedUser);
    alert("Saldo Manual Updated!");
    fetchData();
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-8 hidden md:flex shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg">N</div>
          <h1 className="font-black text-slate-900 uppercase tracking-tighter text-xl">NEXUS<span className="text-slate-400">HUB</span></h1>
        </div>
        <nav className="space-y-3 flex-1">
          {['DASHBOARD', 'PEMAIN', 'TRANSAKSI', 'PENGATURAN'].map((id: any) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
              {id === 'DASHBOARD' ? '📊' : id === 'PEMAIN' ? '👥' : id === 'TRANSAKSI' ? '💳' : '⚙️'} {id}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{activeTab}</h2>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 font-bold text-[10px] text-emerald-500 uppercase tracking-widest">● System Online</div>
        </header>

        {activeTab === 'DASHBOARD' && (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h4 className="text-[11px] font-black uppercase text-slate-900 mb-8 border-l-4 border-yellow-500 pl-4">Quick Manual Inject</h4>
              <div className="space-y-4">
                <select className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none" onChange={(e) => setSelectedUser(e.target.value)}>
                  <option value="">Pilih Username</option>
                  {players.map(p => <option key={p.id} value={p.username}>{p.username}</option>)}
                </select>
                <input type="number" placeholder="Set Saldo Baru" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none font-mono" onChange={(e) => setAmount(Number(e.target.value))} />
                <button onClick={handleManualUpdate} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg">Execute Update</button>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
               <h4 className="text-[11px] font-black uppercase text-slate-900 mb-8 border-l-4 border-slate-200 pl-4">Security Logs</h4>
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                 {logs.map(log => (
                   <div key={log.id} className="text-[10px] p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="font-black text-slate-900 uppercase">{log.action}:</span> {log.detail} <span className="float-right text-slate-300">{log.time}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'TRANSAKSI' && (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="p-8">Player</th>
                  <th className="p-8">Type</th>
                  <th className="p-8">Amount</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-8 font-black text-sm">{t.username}</td>
                    <td className="p-8"><span className={`px-3 py-1 rounded-full text-[9px] font-black ${t.type === 'DEPOSIT' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>{t.type}</span></td>
                    <td className="p-8 font-mono font-bold">IDR {t.amount.toLocaleString()}</td>
                    <td className="p-8"><span className={`text-[9px] font-black ${t.status === 'PENDING' ? 'text-yellow-500 animate-pulse' : t.status === 'SUCCESS' ? 'text-emerald-500' : 'text-red-500'}`}>{t.status}</span></td>
                    <td className="p-8 text-right space-x-2">
                      {t.status === 'PENDING' && (
                        <>
                          <button onClick={() => processTransaction(t, 'SUCCESS')} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md shadow-emerald-100">Approve</button>
                          <button onClick={() => processTransaction(t, 'REJECTED')} className="bg-red-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md shadow-red-100">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'PEMAIN' && (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
             {/* List pemain sama seperti sebelumnya */}
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400">
                   <tr><th className="p-8">Username</th><th className="p-8">Balance</th></tr>
                </thead>
                <tbody>
                   {players.map(p => (
                     <tr key={p.id} className="border-b border-slate-50"><td className="p-8 font-bold">{p.username}</td><td className="p-8 font-mono text-emerald-600">IDR {p.balance.toLocaleString()}</td></tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </main>
    </div>
  );
}
