import { createGenLayerClient } from 'genlayer-js-sdk';

// Alamat kontrak yang baru saja kamu deploy
const SWAP_CONTRACT_ADDRESS = "0x82...585c"; // Pastikan copy alamat lengkapnya

export const getSwapPrice = async (amountIn) => {
    try {
        const client = createGenLayerClient();
        // Memanggil fungsi hitung_swap dari kontrak python kamu
        const result = await client.callView(SWAP_CONTRACT_ADDRESS, "hitung_swap", [parseInt(amountIn)]);
        return result;
    } catch (error) {
        console.error("Gagal hitung harga:", error);
        throw error;
    }
};