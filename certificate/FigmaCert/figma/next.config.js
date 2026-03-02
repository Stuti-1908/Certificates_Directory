/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.figma.com',
        pathname: '/api/mcp/asset/**',
      },
    ],
  },
  // Keep native Node.js modules server-side only
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    // Externalize native modules for server
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@napi-rs/canvas': 'commonjs @napi-rs/canvas',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
