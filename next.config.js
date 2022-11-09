/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
  },
  async rewrites() {
    return [
      {
        source: "/items",
        destination: "/",
      },
    ];
  },
  // experimental: { images: { allowFutureImage: true } },
};

module.exports = nextConfig;
