/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cribflyer-publicsite.s3.amazonaws.com',
      'upload.wikimedia.org',
      'res.cloudinary.com' // Add this domain
    ],
  },
};

export default nextConfig;
