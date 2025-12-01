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
}

module.exports = nextConfig

