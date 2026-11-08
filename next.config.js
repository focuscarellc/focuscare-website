/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
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
      { source: '/resources', destination: '/blog', permanent: true },
      { source: '/testimonials', destination: '/case-studies', permanent: true },
      { source: '/:path*/index.html', destination: '/:path*', permanent: true },
      {
        source: '/get-started',
        destination: '/contact',
        permanent: true, // 301 redirect
      },
    ]
  },
  async rewrites() {
    const routes = require('./design/generated/routes.json')
    return { beforeFiles: routes, afterFiles: [], fallback: [] }
  },
  async headers() {
    return [{ source: '/redesign/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      ...(process.env.SITE_PREVIEW === '1' ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] }] : []),
      { source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    ] }]
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
