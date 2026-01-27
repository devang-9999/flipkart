import type { NextConfig } from "next";

const nextConfig: NextConfig = {
// images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'example.com', 
//         port: '', 
//         pathname: '/account123/**',
//       },
//     ],
//   }
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "wallpaperswide.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wallpapercave.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**"
      },
            {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**"
      }
    
    ],
  
  },

};

export default nextConfig;
