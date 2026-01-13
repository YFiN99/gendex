"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { toast } from "react-hot-toast";

const TOKEN_X_ADDRESS = "0x9B80920ED6cf328A802aaBaBaBd8f1011Ef99aBF";
const DEX_CONTRACT_ADDRESS = "0xC0D0C6236870F192FBD9503d4F36Fd7eB71567a4";

export default function SwapPage() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("1");
  const [isSwapping, setIsSwapping] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleFaucet = async () => {
    if (!isConnected) { toast.error("Connect wallet dulu!"); return; }
    setIsClaiming(true);
    const tId = toast.loading("Claiming 1000 TOKEN X...");
    try {
      const provider = (window as any).ethereum;
      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: address, to: TOKEN_X_ADDRESS, value: '0x0', data: '0x' }],
      });
      setLastTxHash(tx);
      toast.success("Faucet Success!", { id: tId });
    } catch (e) { toast.error("Faucet Gagal"); }
    finally { setIsClaiming(false); }
  };

  const handleSwap = async () => {
    if (!isConnected) { toast.error("Connect wallet dulu!"); return; }
    setIsSwapping(true);
    setLastTxHash(null);
    const tId = toast.loading("Processing Swap...");
    try {
      const provider = (window as any).ethereum;
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: address, to: DEX_CONTRACT_ADDRESS, value: '0x0', data: '0x' }],
      });
      setLastTxHash(txHash);
      toast.success("Swap Berhasil!", { id: tId });
    } catch (e) { toast.error("Swap Gagal"); }
    finally { setIsSwapping(false); }
  };

  if (!mounted) return null;

  return (
    <main style={styles.container} suppressHydrationWarning>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>GenDEX</h1>
            <div style={styles.statusDot}>● GenLayer OK</div>
          </div>
          <button onClick={handleFaucet} disabled={isClaiming} style={styles.faucetBtn}>
            {isClaiming ? "..." : "FREE 1000 X"}
          </button>
        </div>

        {/* INPUT SELL */}
        <div style={styles.inputBox}>
          <div style={styles.inputHeader}>
            <span>Sell</span>
            <span>Balance: {isReversed ? "1.001.000" : "1.250"}</span>
          </div>
          <div style={styles.inputRow}>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={styles.inputRaw} />
            <div style={{...styles.tokenLabel, background: isReversed ? '#4f46e5' : '#222'}}>{isReversed ? "TOKEN X" : "GOLD"}</div>
          </div>
        </div>

        <div style={styles.divider}>
          <button onClick={() => setIsReversed(!isReversed)} style={styles.arrowButton}>↓↑</button>
        </div>

        {/* INPUT BUY */}
        <div style={styles.inputBox}>
          <div style={styles.inputHeader}>
            <span>Buy</span>
            <span>Balance: {isReversed ? "1.250" : "1.001.000"}</span>
          </div>
          <div style={styles.inputRow}>
            <input type="text" value={isReversed ? Number(amount)/10 : Number(amount)*10} readOnly style={styles.inputRaw} />
            <div style={{...styles.tokenLabel, background: isReversed ? '#222' : '#4f46e5'}}>{isReversed ? "GOLD" : "TOKEN X"}</div>
          </div>
        </div>

        {/* TOMBOL SWAP */}
        <div style={{marginTop: '20px'}}>
          {!isConnected ? (
            <button onClick={connectWallet} style={styles.mainButton}>CONNECT WALLET</button>
          ) : (
            <button onClick={handleSwap} disabled={isSwapping} style={styles.mainButton}>
              {isSwapping ? "PROCESSING..." : "SWAP NOW"}
            </button>
          )}
        </div>

        {/* TRANSACTION HASH AREA */}
        {lastTxHash && (
          <div style={styles.hashContainer}>
            <p style={styles.hashTitle}>TRANSACTION HASH:</p>
            <code style={styles.hashCode}>{lastTxHash}</code>
            <a href={`https://explorer.genlayer.com/tx/${lastTxHash}`} target="_blank" style={styles.explorerLink}>
              View on Explorer ↗
            </a>
          </div>
        )}

        <div style={styles.footerInfo}>
          DEX: {DEX_CONTRACT_ADDRESS.slice(0, 22)}...
          {isConnected && <div onClick={disconnectWallet} style={styles.disconnectText}>Disconnect Wallet</div>}
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' },
  card: { background: '#0d0d0d', padding: '25px', borderRadius: '24px', border: '1px solid #1a1a1a', width: '400px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#fff', fontSize: '20px', fontWeight: 'bold' },
  statusDot: { color: '#10b981', fontSize: '10px', marginTop: '4px' },
  faucetBtn: { background: '#10b981', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  inputBox: { background: '#141414', padding: '16px', borderRadius: '16px', border: '1px solid #1f1f1f' },
  inputHeader: { display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '11px', marginBottom: '8px' },
  inputRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  inputRaw: { background: 'transparent', border: 'none', color: '#fff', fontSize: '22px', outline: 'none', width: '50%', fontWeight: 'bold' },
  tokenLabel: { color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },
  divider: { textAlign: 'center', margin: '-18px 0', position: 'relative', zIndex: 10 },
  arrowButton: { background: '#0d0d0d', border: '1px solid #333', width: '38px', height: '38px', borderRadius: '12px', color: '#fff', cursor: 'pointer' },
  mainButton: { width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#4f46e5', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  hashContainer: { marginTop: '20px', padding: '15px', background: '#080808', border: '1px dashed #222', borderRadius: '12px' },
  hashTitle: { fontSize: '9px', color: '#444', margin: '0 0 5px 0' },
  hashCode: { fontSize: '9px', color: '#10b981', wordBreak: 'break-all', display: 'block', marginBottom: '8px' },
  explorerLink: { color: '#4f46e5', fontSize: '10px', textDecoration: 'none' },
  footerInfo: { marginTop: '20px', textAlign: 'center', fontSize: '9px', color: '#222' },
  disconnectText: { color: '#444', cursor: 'pointer', textDecoration: 'underline', marginTop: '8px' }
};