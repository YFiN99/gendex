"use client";

// BARIS SAKTI: Memaksa Vercel tidak error WagmiProvider saat build
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function SwapPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  
  const [mounted, setMounted] = useState(false);

  // Mencegah error tampilan antara server dan browser
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md bg-[#121212] border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">build labs</h1>
          
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
              className="bg-zinc-800 text-zinc-400 text-xs py-2 px-4 rounded-xl border border-zinc-700"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
             <p className="text-zinc-500 text-xs mb-1">Status</p>
             <p className={isConnected ? "text-green-400" : "text-red-400"}>
               {isConnected ? "Wallet Connected" : "Please Connect"}
             </p>
          </div>
          
          <button
            disabled={!isConnected}
            className={`w-full py-4 rounded-2xl font-bold transition-all ${
              isConnected ? "bg-indigo-600 hover:bg-indigo-700" : "bg-zinc-800 text-zinc-600"
            }`}
          >
            {isConnected ? "SWAP NOW" : "CONNECT REQUIRED"}
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
