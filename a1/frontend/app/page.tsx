'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { getAddress, encodeFunctionData } from 'viem';

// --- CONFIGURATION ---
const DEX_ADDR = getAddress('0xC0D0C6236870F192FBD9503d4F36Fd7eB71567a4');
const COIN_ADDR = getAddress('0x9B80920ED6cf328A802aaBaBaBd8f1011Ef99aBF');

const ABI = [
  { name: 'swap', type: 'function', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'faucet', type: 'function', inputs: [], outputs: [] },
  { name: 'get_balance', type: 'function', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'get_balance_of', type: 'function', inputs: [{ name: 'address', type: 'string' }], outputs: [{ name: '', type: 'uint256' }] }
] as const;

export default function SwapPage() {
  const [amountIn, setAmountIn] = useState('');
  const [goldBalance, setGoldBalance] = useState('0');
  const [xCoinBalance, setXCoinBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [status, setStatus] = useState({ type: 'idle', msg: '' });

  useEffect(() => {
    setIsMounted(true);
    const connect = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accs && accs.length > 0) setAccount(getAddress(accs[0]));
        } catch (e) { console.error("Koneksi gagal"); }
      }
    };
    connect();
  }, []);

  const fetchData = async (userAddr: string) => {
    try {
      const client = createClient({ chain: studionet });
      
      // Menggunakan ?. dan ?? '0' untuk menghindari error "possibly null" di Vercel
      const coinData = await client.readContract({
        address: COIN_ADDR, 
        functionName: 'get_balance_of', 
        args: [userAddr.toLowerCase()],
      });
      setXCoinBalance(coinData?.toString() ?? '0');

      const goldData = await client.readContract({
        address: DEX_ADDR, 
        functionName: 'get_balance', 
        args: [userAddr],
      });
      setGoldBalance(goldData?.toString() ?? '0');

    } catch (err) { 
      console.error("Data fetch error:", err); 
    }
  };

  useEffect(() => {
    if (account && isMounted) fetchData(account);
  }, [account, isMounted]);

  const handleFaucet = async () => {
    if (!account) return alert('Hubungkan MetaMask!');
    setIsLoading(true);
    setStatus({ type: 'idle', msg: 'Mengambil 1000 X-COIN gratis...' });
    try {
      const client = createClient({ chain: studionet });
      const callData = encodeFunctionData({ abi: ABI, functionName: 'faucet', args: [] });
      await client.sendTransaction({ 
        account: account as `0x${string}`, 
        to: COIN_ADDR, 
        data: callData, 
        gas: BigInt(2000000) 
      } as any);
      
      setStatus({ type: 'success', msg: 'Koin gratis berhasil dikirim!' });
      setTimeout(() => { fetchData(account); setIsLoading(false); }, 8000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Gagal mengambil koin.' });
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!account || !amountIn) return alert('Input tidak valid!');
    setIsLoading(true);
    setStatus({ type: 'idle', msg: 'Memproses Intelligent Swap...' });
    try {
      const client = createClient({ chain: studionet });
      const callData = encodeFunctionData({ abi: ABI, functionName: 'swap', args: [BigInt(amountIn)] });
      await client.sendTransaction({ 
        account: account as `0x${string}`, 
        to: DEX_ADDR, 
        data: callData, 
        gas: BigInt(4000000) 
      } as any);
      
      setStatus({ type: 'success', msg: 'Swap Berhasil!' });
      setTimeout(() => { fetchData(account); setIsLoading(false); setAmountIn(''); }, 10000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Swap Gagal.' });
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>build labs</h1>
          <button onClick={handleFaucet} disabled={isLoading} style={styles.faucetBadge}>
            Get Free X-COIN
          </button>
        </div>

        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>X-COIN (Wallet)</span>
            <span style={styles.statValueCoin}>{xCoinBalance}</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>GOLD (DEX)</span>
            <span style={styles.statValueGold}>{goldBalance}</span>
          </div>
        </div>

        <div style={styles.inputArea}>
          <input 
            type="number" value={amountIn} 
            onChange={(e) => setAmountIn(e.target.value)}
            style={styles.input} placeholder="0.0"
          />
        </div>

        <button onClick={handleSwap} disabled={isLoading || !amountIn} style={styles.button}>
          {isLoading ? 'PROCESSING...' : 'SWAP NOW'}
        </button>

        {status.msg && <div style={{ ...styles.statusMessage, color: status.type === 'error' ? '#ff4d4d' : '#00ff88' }}>{status.msg}</div>}
        
        <div style={styles.footer}>
           <button onClick={() => fetchData(account)} style={styles.refreshBtn}>↺ Refresh Data</button>
        </div>
      </div>
    </div>
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
