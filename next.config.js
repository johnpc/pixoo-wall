/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  tsconfigPath: "./tsconfig.json",
  env: {
    UNIQUE_NOTIFICATION_TOPIC: process.env.UNIQUE_NOTIFICATION_TOPIC,
    NTFY_URL: process.env.NTFY_URL,
    NTFY_AUTH_HEADER: process.env.NTFY_AUTH_HEADER,
    PIXOO_IP: process.env.PIXOO_IP,
  },
};

module.exports = nextConfig;
