/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async redirects() {
    return [
      {
        source: '/get-started',
        destination: '/contact',
        permanent: true, // 301 redirect
      },
    ]
  },
}

// Try to import user config (use require instead of import for CommonJS)
let userConfig = {}
try {
  userConfig = require('./v0-user-next.config')
} catch (e) {
  // ignore error
}

// Merge configs
function mergeConfig(baseConfig, userConfig) {
  if (!userConfig) {
    return baseConfig
  }

  const mergedConfig = { ...baseConfig }

  for (const key in userConfig) {
    if (
      typeof baseConfig[key] === 'object' &&
      !Array.isArray(baseConfig[key])
    ) {
      mergedConfig[key] = {
        ...baseConfig[key],
        ...userConfig[key],
      }
    } else {
      mergedConfig[key] = userConfig[key]
    }
  }

  return mergedConfig
}

// Export the merged config
module.exports = mergeConfig(nextConfig, userConfig)