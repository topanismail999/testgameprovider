import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetchPlayers();
    const sub = supabase.channel('players-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => fetchPlayers()).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchPlayers = async () => {
    const { data } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    if (data) setPlayers(data);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return alert("Pilih pemain dulu!");
    const { error } = await supabase.from('players').update({ balance: amount }).eq('username', selectedUser);
    if (!error) alert("Saldo Updated!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-slate-900 border-2 border-purple-500/30 rounded-[3rem] p-8 shadow-2xl">
        <h1 className="text-2xl font-black italic text-purple-500 mb-8 uppercase tracking-tighter">Nexus Backoffice Master</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-500">Manual Inject Balance</h2>
            <select className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none text-sm" onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Pilih Username Pemain</option>
              {players.map(p => <option key={p.id} value={p.username}>{p.username} (Saldo: {p.balance})</option>)}
            </select>
            <input type="number" placeholder="Set Saldo Baru" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none" onChange={(e) => setAmount(Number(e.target.value))} />
            <button onClick={handleUpdate} className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase text-sm tracking-widest">Update Saldo Server</button>
          </div>

          <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 max-h-[500px] overflow-y-auto">
            <h2 className="text-xs font-black uppercase text-slate-500 mb-4 italic">Live Player List</h2>
            <div className="space-y-2">
              {players.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl text-[10px]">
                  <span className="font-bold">{p.username}</span>
                  <span className="text-emerald-400 font-mono">IDR {p.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
