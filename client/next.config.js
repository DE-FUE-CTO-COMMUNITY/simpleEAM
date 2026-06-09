import path from 'node:path'
import { fileURLToPath } from 'node:url'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React StrictMode to prevent controlled/uncontrolled warnings in development
  // This is only for testing - StrictMode is automatically disabled in production anyway
  reactStrictMode: false,
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['dev-server.mf2.eu'],
  // Other configurations...
  transpilePackages: [],
}

export default withNextIntl(nextConfig)
