
/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config();
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // swcMinify: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
        pathname: '/ipfs/**',
      },
    ],
  },
   env: {
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
  },
};

module.exports =  nextConfig;
