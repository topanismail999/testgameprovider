import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PEMAIN' | 'TRANSAKSI' | 'PENGATURAN'>('DASHBOARD');
  const [players, setPlayers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState(0);
  const [stats, setStats] = useState({ online: 0, totalDepo: 0 });

  useEffect(() => {
    fetchData();
    const sub = supabase.channel('admin-white').on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => fetchData()).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchData = async () => {
    const { data: pData } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    if (pData) {
      setPlayers(pData);
      setStats({
        online: Math.floor(Math.random() * 50) + 10,
        totalDepo: pData.reduce((acc, curr) => acc + (curr.balance || 0), 0)
      });
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser) return alert("Pilih pemain!");
    const { error } = await supabase.from('players').update({ balance: amount }).eq('username', selectedUser);
    if (!error) {
      const newLog = { 
        id: Date.now(), 
        action: `Update Saldo ${selectedUser}`, 
        detail: `Nominal: IDR ${amount.toLocaleString()}`, 
        time: new Date().toLocaleTimeString() 
      };
      setLogs([newLog, ...logs]);
      alert("Saldo Berhasil Diperbarui!");
      fetchData();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* SIDEBAR - LUXURY WHITE */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-8 hidden md:flex shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white shadow-lg">N</div>
          <h1 className="font-black text-slate-900 uppercase tracking-tighter text-xl underline decoration-yellow-500 decoration-4">NEXUS<span className="text-slate-400">HUB</span></h1>
        </div>
        
        <nav className="space-y-3 flex-1">
          {[
            { id: 'DASHBOARD', icon: '📊', label: 'Overview' },
            { id: 'PEMAIN', icon: '👥', label: 'User Manager' },
            { id: 'TRANSAKSI', icon: '💳', label: 'Ledger' },
            { id: 'PENGATURAN', icon: '🛠️', label: 'Settings' }
          ].map((item: any) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <span className="text-lg">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-100">
          <a href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 hover:text-slate-900 transition-colors">
             <span>🌐</span> Live Player Site
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        <header className="flex justify-between items-center mb-12">
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mb-1">Administrative Terminal</p>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{activeTab}</h2>
          </div>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 px-4">
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Status</p>
                <p className="text-[11px] font-bold text-emerald-500 uppercase">System Active</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">👤</div>
          </div>
        </header>

        {activeTab === 'DASHBOARD' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase">Pemain Online</p>
                   <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black px-2 py-1 rounded-full uppercase">Live</span>
                </div>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stats.online}</h3>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Total Holding Balance</p>
                <h3 className="text-3xl font-black tracking-tight italic">IDR {stats.totalDepo.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Global Risk</p>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Minimal Risk ✅</h3>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* ACTION PANEL */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <h4 className="text-[11px] font-black uppercase text-slate-900 mb-8 border-l-4 border-yellow-500 pl-4">Management Command</h4>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Select Account</label>
                    <select className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none text-sm font-bold text-slate-700 appearance-none cursor-pointer" onChange={(e) => setSelectedUser(e.target.value)}>
                      <option value="">-- Choose Username --</option>
                      {players.map(p => <option key={p.id} value={p.username}>{p.username}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">New Balance (IDR)</label>
                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none font-mono text-lg font-bold text-slate-900" onChange={(e) => setAmount(Number(e.target.value))} />
                  </div>
                  <button onClick={handleUpdateBalance} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">Execute Transaction</button>
                </div>
              </div>

              {/* LOG ACTIVITY */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                <h4 className="text-[11px] font-black uppercase text-slate-900 mb-8 border-l-4 border-slate-200 pl-4 italic">Security Logs</h4>
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scroll">
                  {logs.length === 0 && <p className="text-[10px] text-slate-300 italic text-center py-20 uppercase font-black tracking-widest">No Recent Activity</p>}
                  {logs.map(log => (
                    <div key={log.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center group">
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase mb-1">{log.action}</p>
                        <p className="text-[10px] text-slate-400 font-mono italic">{log.detail}</p>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300 group-hover:text-slate-900 transition-colors">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PEMAIN' && (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Account Profile</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Liquidity</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {players.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-8">
                       <p className="text-sm font-black text-slate-900">{p.username}</p>
                       <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">Reg: {new Date(p.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="p-8 text-sm font-mono font-black text-slate-900 italic">IDR {p.balance.toLocaleString()}</td>
                    <td className="p-8 text-right">
                      <button className="text-[9px] font-black text-slate-900 border-2 border-slate-900 px-5 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
