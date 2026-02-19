/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Це дозволить завантажувати фото з БУДЬ-ЯКОГО сайту
      },
    ],
  },
};

export default nextConfig;
