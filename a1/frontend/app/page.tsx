"use client";

// Paksa Next.js agar tidak error saat proses build di Vercel
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function SwapPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("5");

  // Efek ini memastikan tombol hanya muncul di browser (Client-Side)
  // Ini solusi ampuh untuk error 'WagmiProviderNotFoundError'
  useEffect(() => {
    setMounted(true);
  }, []);

  // Jika belum 'mounted', jangan tampilkan apa-apa dulu untuk menghindari error Vercel
  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      {/* Box Utama Swap */}
      <div className="w-full max-w-md bg-[#121212] border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Header Bagian Atas */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">build labs</h1>
          
          {/* LOGIC TOMBOL CONNECT WALLET */}
          {!isConnected ? (
            <div className="flex gap-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-zinc-800 border border-zinc-700 px-3 py-2 rounded-xl text-xs text-zinc-300">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <button
                onClick={() => disconnect()}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs p-2 rounded-xl border border-red-500/20 transition-all"
                title="Disconnect Wallet"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Tampilan Saldo/Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">X-COIN Balance</p>
            <p className="text-blue-400 text-xl font-bold">0.00</p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1">GOLD Balance</p>
            <p className="text-yellow-500 text-xl font-bold">0.00</p>
          </div>
        </div>

        {/* Form Input Swap */}
        <div className="space-y-4">
          <div className="bg-black border border-zinc-800 rounded-2xl p-4 focus-within:border-indigo-500 transition-all">
            <label className="text-zinc-500 text-xs mb-2 block">Amount to Swap</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-3xl font-medium focus:outline-none text-white"
              placeholder="0.0"
            />
          </div>

          {/* Tombol Eksekusi Swap */}
          <button
            disabled={!isConnected}
            className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all shadow-xl ${
              isConnected 
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 active:scale-[0.98] text-white" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed uppercase"
            }`}
          >
            {isConnected ? "EXECUTE SWAP" : "Wallet Required"}
          </button>
        </div>

        {/* Info Tambahan */}
        <p className="mt-4 text-center text-zinc-600 text-[10px]">
          Powered by GenLayer Network • {isConnected ? 'Network Ready' : 'Network Disconnected'}
        </p>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { backgroundColor: '#08080a', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' },
  card: { background: '#121214', padding: '32px', borderRadius: '24px', border: '1px solid #222', width: '380px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '18px', fontWeight: 'bold' },
  faucetBadge: { background: '#1e1b4b', color: '#818cf8', border: '1px solid #3730a3', padding: '5px 10px', borderRadius: '8px', fontSize: '10px', cursor: 'pointer' },
  statsContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' },
  statBox: { background: '#1a1a1d', padding: '16px', borderRadius: '16px', border: '1px solid #28282b' },
  statLabel: { display: 'block', fontSize: '10px', color: '#888', marginBottom: '4px' },
  statValueCoin: { fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' },
  statValueGold: { fontSize: '18px', fontWeight: 'bold', color: '#fbbf24' },
  inputArea: { marginBottom: '20px' },
  input: { width: '100%', padding: '15px', background: '#000', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '18px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(45deg, #4f46e5, #9333ea)', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  statusMessage: { marginTop: '20px', fontSize: '12px', textAlign: 'center' },
  footer: { textAlign: 'center', marginTop: '15px' },
  refreshBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '12px' }
};
