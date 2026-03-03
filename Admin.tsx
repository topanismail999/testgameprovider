import React, { useState } from 'react';

export default function Admin() {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);

  const handleUpdate = () => {
    localStorage.setItem('nexus_user', JSON.stringify({ username, balance }));
    alert(`Saldo ${username} berhasil diatur ke IDR ${balance.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border-2 border-purple-500/30 rounded-[3rem] p-10 shadow-2xl">
        <h1 className="text-2xl font-black uppercase italic text-purple-500 mb-8 text-center">Nexus Backoffice</h1>
        <div className="space-y-4">
          <input type="text" placeholder="Username Pemain" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500" onChange={(e) => setUsername(e.target.value)} />
          <input type="number" placeholder="Set Saldo (IDR)" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500" onChange={(e) => setBalance(Number(e.target.value))} />
          <button onClick={handleUpdate} className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Update Saldo</button>
          <a href="/" className="block text-center text-[10px] font-black text-slate-600 uppercase mt-4 underline">Lihat Web Utama</a>
        </div>
      </div>
    </div>
  );
}
