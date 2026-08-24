import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Configurações adicionais para produção
  compress: true,

  // otimização de imagens remotas usadas no Hero e CMS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.backblazeb2.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Headers de segurança robustos
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Previne DNS prefetching não autorizado
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // X-Frame-Options removido para permitir Google Maps em iframe
          // Previne MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Content Security Policy - Proteção contra XSS
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob: https://*.googleapis.com https://*.gstatic.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://maps.googleapis.com data: blob: https:",
              "worker-src 'self' blob:",
              "frame-src 'self' https://www.google.com https://maps.google.com",
              "media-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          // Permissions Policy - Controla APIs do navegador
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=(self)', // Permite geolocation para o próprio site
              'interest-cohort=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()'
            ].join(', ')
          },
          // Política de referrer mais permissiva para Google Maps
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade'
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
