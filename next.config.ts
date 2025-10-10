import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Configurações adicionais para produção
  compress: true,
  
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
          // Previne clickjacking - permite apenas same origin
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js precisa de unsafe-inline
              "style-src 'self' 'unsafe-inline'", // Tailwind precisa de unsafe-inline
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // Permissions Policy - Controla APIs do navegador
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()'
            ].join(', ')
          },
          // Política de referrer segura
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Força HTTPS (será ativado quando SSL estiver configurado)
          // Descomente após configurar SSL
          // {
          //   key: 'Strict-Transport-Security',
          //   value: 'max-age=31536000; includeSubDomains; preload'
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
