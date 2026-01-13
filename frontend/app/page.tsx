"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/lib/genlayer/WalletProvider";
import { toast } from "react-hot-toast";

// Alamat Kontrak dari Studio Anda
const TOKEN_X_ADDRESS = "0x9B80920ED6cf328A802aaBaBaBd8f1011Ef99aBF";
const DEX_CONTRACT_ADDRESS = "0xC0D0C6236870F192FBD9503d4F36Fd7eB71567a4";

export default function SwapPage() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("1");
  const [isSwapping, setIsSwapping] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>("");

  // State Saldo
  const [balanceX, setBalanceX] = useState<string>("0");
  const [balanceGold, setBalanceGold] = useState<string>("1250");

  // FUNGSI SYNC BERDASARKAN GENLAYER NODE API (gen_call)
  const syncBalance = useCallback(async () => {
    if (!address || !isConnected) return;
    try {
      const provider = (window as any).ethereum;
      
      // Menggunakan gen_call dengan Type: "read" sesuai dokumen GenLayer
      const response = await provider.request({
        method: 'gen_call',
        params: [
          {
            Type: "read",
            from: address,
            to: TOKEN_X_ADDRESS,
            // Data hex untuk memanggil get_balance_of(address)
            Data: "0x70a08231" + address.replace("0x", "").toLowerCase().padStart(64, "0"),
          }
        ],
      });

      if (response && response == "0x") {
        const numericBalance = parseInt(response, 16);
        setBalanceX(numericBalance.toLocaleString());
      }
    } catch (e) {
      console.warn("gen_call gagal, mencoba fallback eth_getBalance...");
      try {
        const fallbackBal = await (window as any).ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        if (fallbackBal) setBalanceX(parseInt(fallbackBal, 16).toLocaleString());
      } catch (err) {
        console.error("Semua metode sync gagal");
      }
    }
  }, [address, isConnected]);

  useEffect(() => {
    setMounted(true);
    if (isConnected) {
      syncBalance();
      const interval = setInterval(syncBalance, 5000); // Cek tiap 5 detik
      return () => clearInterval(interval);
    }
  }, [isConnected, syncBalance]);

  // Handle Faucet
  const handleFaucet = async () => {
    if (!isConnected) return;
    setIsClaiming(true);
    const tId = toast.loading("Requesting Token X...");
    try {
      const provider = (window as any).ethereum;
      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: address, to: TOKEN_X_ADDRESS, value: '0x0' }],
      });
      setLastTxHash(tx);
      toast.success("Faucet Success!", { id: tId });
      
      // Optimistic Update: Tambah 1000 langsung di UI
      setBalanceX(prev => (parseInt(prev.replace(/,/g, "")) + 1000).toLocaleString());
    } catch (e) { toast.error("Faucet Gagal"); }
    finally { setIsClaiming(false); }
  };

  // Handle Swap
  const handleSwap = async () => {
    if (!isConnected) return;
    setIsSwapping(true);
    const tId = toast.loading("Executing Swap...");
    try {
      const provider = (window as any).ethereum;
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: address, to: DEX_CONTRACT_ADDRESS, value: '0x0' }],
      });
      setLastTxHash(txHash);
      
      // Optimistic Update: Ubah angka di UI secara instan
      const val = parseInt(amount);
      if (isReversed) {
        setBalanceX(p => (parseInt(p.replace(/,/g, "")) - val).toLocaleString());
        setBalanceGold(p => (parseInt(p.replace(/,/g, "")) + val/10).toLocaleString());
      } else {
        setBalanceGold(p => (parseInt(p.replace(/,/g, "")) - val).toLocaleString());
        setBalanceX(p => (parseInt(p.replace(/,/g, "")) + val*10).toLocaleString());
      }
      toast.success("Swap Berhasil!", { id: tId });
    } catch (e) { toast.error("Swap Gagal"); }
    finally { setIsSwapping(false); }
  };

  if (!mounted) return null;

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>GenDEX</h1>
            <div style={styles.statusDot}>● {isConnected ? 'GenVM Connected' : 'Disconnected'}</div>
          </div>
          <button onClick={handleFaucet} disabled={isClaiming} style={styles.faucetBtn}>
            {isClaiming ? "..." : "FREE 1000 X"}
          </button>
        </div>

        <div style={styles.inputBox}>
          <div style={styles.inputHeader}>
            <span>Sell</span>
            <span>Balance: {isReversed ? balanceX : balanceGold}</span>
          </div>
          <div style={styles.inputRow}>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={styles.inputRaw} />
            <div style={{...styles.tokenLabel, background: isReversed ? '#4f46e5' : '#222'}}>{isReversed ? "TOKEN X" : "GOLD"}</div>
          </div>
        </div>

        <div style={styles.divider}>
          <button onClick={() => setIsReversed(!isReversed)} style={styles.arrowButton}>↓↑</button>
        </div>

        <div style={styles.inputBox}>
          <div style={styles.inputHeader}>
            <span>Buy</span>
            <span>Balance: {isReversed ? balanceGold : balanceX}</span>
          </div>
          <div style={styles.inputRow}>
            <input type="text" value={isReversed ? Number(amount)/10 : Number(amount)*10} readOnly style={styles.inputRaw} />
            <div style={{...styles.tokenLabel, background: isReversed ? '#222' : '#4f46e5'}}>{isReversed ? "GOLD" : "TOKEN X"}</div>
          </div>
        </div>

        <div style={{marginTop: '20px'}}>
          {!isConnected ? (
            <button onClick={connectWallet} style={styles.mainButton}>CONNECT WALLET</button>
          ) : (
            <button onClick={handleSwap} disabled={isSwapping} style={styles.mainButton}>
              {isSwapping ? "PROCESSING..." : "SWAP NOW"}
            </button>
          )}
        </div>

        {lastTxHash && (
          <div style={styles.hashContainer}>
            <p style={styles.hashTitle}>TX HASH:</p>
            <code style={styles.hashCode}>{lastTxHash}</code>
            <a href={`https://explorer.genlayer.com/tx/${lastTxHash}`} target="_blank" style={styles.explorerLink}>View on Explorer ↗</a>
          </div>
        )}

        <div style={styles.footerInfo}>
          {isConnected ? `Wallet: ${address?.slice(0, 10)}...${address?.slice(-4)}` : 'GenLayer Intelligent DEX'}
          {isConnected && <div onClick={disconnectWallet} style={styles.disconnectText}>Disconnect</div>}
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { backgroundColor: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' },
  card: { background: '#0d0d0d', padding: '25px', borderRadius: '24px', border: '1px solid #1a1a1a', width: '390px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#fff', fontSize: '20px', fontWeight: 'bold' },
  statusDot: { color: '#10b981', fontSize: '10px' },
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
  footerInfo: { marginTop: '20px', textAlign: 'center', fontSize: '9px', color: '#333' },
  disconnectText: { color: '#555', cursor: 'pointer', textDecoration: 'underline', marginTop: '8px' }
};
