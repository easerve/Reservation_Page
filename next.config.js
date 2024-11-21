/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 오류 무시
  },
};

module.exports = nextConfig;
