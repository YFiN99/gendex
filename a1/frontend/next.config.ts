/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan baris ini untuk mengizinkan library genlayer dibaca oleh Next.js
  transpilePackages: ['genlayer'],
};

export default nextConfig;