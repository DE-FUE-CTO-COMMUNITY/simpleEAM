import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

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
  webpack: config => {
    return config
  },
}

export default withNextIntl(nextConfig)
