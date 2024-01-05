/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    UNIQUE_NOTIFICATION_TOPIC: process.env.UNIQUE_NOTIFICATION_TOPIC,
    PIXOO_IP: process.env.PIXOO_IP,
  },
};

module.exports = nextConfig;
