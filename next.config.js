/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [],
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@react-three/fiber': require('path').resolve(__dirname, 'lib/react-three-fiber.tsx'),
      '@react-three/drei': require('path').resolve(__dirname, 'lib/react-three-drei.tsx'),
    };
    return config;
  },
};

module.exports = nextConfig;
