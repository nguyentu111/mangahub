/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // unoptimized: true,
    domains: [
      "www.truyentranhlh.net",
      "3.bp.blogspot.com",
      "cdn4.lhmanga.com",
      "1.bp.blogspot.com",
      "cdn1.lhmanga.com",
      "metac.nxtv.jp",
    ],
  },
};

module.exports = nextConfig;
