/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'raw-loader',
        },
        {
          loader: 'glslify-loader',
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
