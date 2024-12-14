/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')
const bundleAnalyzer = withBundleAnalyzer({enabled: utils.ANALYZE === 'true'})
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  }
};

module.exports =  nextConfig;
