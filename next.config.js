/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TEMI_API_URL: process.env.TEMI_API_URL,
    TEMI_API_KEY: process.env.TEMI_API_KEY,
    TEMI_ROBOT_ID: process.env.TEMI_ROBOT_ID,
    TEMI_ROBOT_IP: process.env.TEMI_ROBOT_IP,
    TEMI_ROBOT_PORT: process.env.TEMI_ROBOT_PORT,
  },
  webpack: (config, { isServer }) => {
    // temi-api-unified를 메인 번들에 포함 (청크 분리 방지)
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // temi-api-unified 관련 파일을 메인 번들에 강제 포함
            temiApi: {
              test: /[\\/]src[\\/]lib[\\/]temi-api-unified\.(ts|tsx|js|jsx)$/,
              name: false, // 메인 번들에 포함
              chunks: 'all',
              enforce: true,
              priority: 30,
            },
            // temi-webview-interface도 메인 번들에 포함
            temiWebView: {
              test: /[\\/]src[\\/]lib[\\/]temi-webview-interface\.(ts|tsx|js|jsx)$/,
              name: false, // 메인 번들에 포함
              chunks: 'all',
              enforce: true,
              priority: 30,
            },
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig

