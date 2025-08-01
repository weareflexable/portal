/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'd3-interpolate': 'commonjs d3-interpolate'
      });
    }
    return config;
  },
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
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  }
};

module.exports =  nextConfig;
