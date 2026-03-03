import React, { useState } from 'react';

export default function Admin() {
  const [playerUsername, setPlayerUsername] = useState("");
  const [newBalance, setNewBalance] = useState(0);

  const handleInjectSaldo = () => {
    localStorage.setItem('nexus_user', JSON.stringify({ username: playerUsername, balance: newBalance }));
    alert("Saldo Berhasil Di-Inject!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-slate-900 border-2 border-purple-500/30 rounded-[3rem] p-10 shadow-2xl">
        <h1 className="text-2xl font-black uppercase italic text-purple-500 mb-8 text-center text-nowrap">Nexus Backoffice</h1>
        <div className="space-y-6">
          <input 
            type="text" 
            value={playerUsername}
            onChange={(e) => setPlayerUsername(e.target.value)}
            className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500" 
            placeholder="Username Pemain"
          />
          <input 
            type="number" 
            value={newBalance}
            onChange={(e) => setNewBalance(Number(e.target.value))}
            className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500" 
            placeholder="Set Saldo"
          />
          <button onClick={handleInjectSaldo} className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all">Update Saldo</button>
          <a href="/" className="block text-center text-[10px] font-black text-slate-600 uppercase mt-4">Lihat Web Pemain</a>
        </div>
      </div>
    </div>
  );
}
