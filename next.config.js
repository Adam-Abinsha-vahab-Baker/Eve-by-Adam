/** @type {import('next').NextConfig} */

// Import 'withNextVideo' at the top
const { withNextVideo } = require('next-video/process');

// Define the next.js config
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

// Wrap the nextConfig with withNextVideo and any additional settings
module.exports = withNextVideo(nextConfig, {
  provider: 'backblaze',
  providerConfig: {
    backblaze: { endpoint: 'https://s3.us-west-000.backblazeb2.com' },
  },
});
