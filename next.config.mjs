/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      // "trysai.s3.us-west-1.amazonaws.com",
      "all-for-ai.s3.us-east-2.amazonaws.com"
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf2json'],
  },
};

export default nextConfig;
