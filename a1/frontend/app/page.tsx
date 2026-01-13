"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function SwapPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  
  const [amount, setAmount] = useState("5");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      {/* Container Utama */}
      <div className="w-full max-w-md bg-[#121212] border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        
        {/* Header & Logo */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">build labs</h1>
          
          {/* TOMBOL KONEKSI DYNAMIC */}
          {!isConnected ? (
            connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all"
              >
                Connect Wallet
              </button>
            ))
          ) : (
            <button
              onClick={() => disconnect()}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs py-2 px-4 rounded-xl transition-all border border-zinc-700"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          )}
        </div>

        {/* Card Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500 text-xs mb-1">X-COIN (Wallet)</p>
            <p className="text-blue-400 text-xl font-bold">0</p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500 text-xs mb-1">GOLD (DEX)</p>
            <p className="text-yellow-500 text-xl font-bold">0</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-2xl font-medium focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="0"
            />
          </div>

          {/* Tombol Swap Utama */}
          <button
            disabled={!isConnected}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              isConnected 
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 active:scale-[0.98]" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {isConnected ? "SWAP NOW" : "Please Connect Wallet"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-center">
          <button className="text-zinc-600 text-xs hover:text-zinc-400 flex items-center gap-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
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
