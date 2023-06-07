/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'bcole-next-ecommerce.s3.us-east-2.amazonaws.com',
      'bcole-next-ecommerce.s3.amazonaws.com',
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
