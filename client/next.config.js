/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React StrictMode to prevent controlled/uncontrolled warnings in development
  // This is only for testing - StrictMode is automatically disabled in production anyway
  reactStrictMode: false,

  experimental: {
    // Enable experimental features if needed
  },

  // Other configurations...
  transpilePackages: [],

  // Webpack configuration if needed
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config
  },
}

module.exports = nextConfig
