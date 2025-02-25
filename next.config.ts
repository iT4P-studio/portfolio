/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    // もし外部ホストを使う場合、remotePatternsやdomainsを設定していてもOK
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
    ],
    // domains: ['pbs.twimg.com'], // 旧式設定でも可
  },
};

export default nextConfig;
