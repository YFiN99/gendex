import { GenLayer(ethers), Address } from "@genlayer/sdk";
import fs from "fs";
import path from "path";

async function main() {
  // 1. Inisialisasi Provider (sesuaikan RPC URL jika menggunakan testnet/local)
  const provider = new GenLayer.JsonRpcProvider("http://localhost:8080");

  // 2. Setup Wallet menggunakan Private Key (pastikan ada saldo untuk gas)
  const privateKey = "0xYOUR_PRIVATE_KEY_HERE"; // Ganti dengan private key kamu
  const wallet = new GenLayer.Wallet(privateKey, provider);

  console.log("Deploying Contractdex...");

  // 3. Baca file kontrak Python (Contractdex)
  const contractPath = path.resolve(__dirname, "../contractdex.py");
  const contractCode = fs.readFileSync(contractPath, "utf8");

  try {
    // 4. Proses Deployment
    // Kita tidak mengirimkan argumen ke __init__ karena alamat X-COIN 
    // sudah di-hardcode di dalam kode Python kamu.
    const deployment = await wallet.deployContract({
      code: contractCode,
      args: [], 
      leaderOnly: true, // Opsional: tergantung konfigurasi konsensus yang diinginkan
    });

    console.log("------------------------------------------");
    console.log("Deployment Sukses!");
    console.log(`Contract Address: ${deployment.address}`);
    console.log(`Transaction Hash: ${deployment.transactionHash}`);
    console.log("------------------------------------------");

  } catch (error) {
    console.error("Deployment Gagal:", error);
  }
}

main();
