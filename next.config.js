// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  compress: true,
  basePath: '',
  async headers() {
    return [
      {
        // Fonts
        source: '/:all*(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.livehindustan.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*'
          }
        ],
      },
      {
        // CSS and JS files
        source: '/:all*(css|js)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.livehindustan.com'
          }
        ],
      }
    ]
  }
};

module.exports = nextConfig;