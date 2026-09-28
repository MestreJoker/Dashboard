import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gruporeciclo.com',
        pathname: '**',
      },
    ],
  },
  
  // GARANTE QUE ARQUIVOS ESTÁTICOS SEJAM SERVIDOS CORRETAMENTE
  staticPageGenerationTimeout: 30,

  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://localhost:8085/:path*',
      },
    ];
  },

  // CORRIGE ISSUES DE ACESSO VIA IP LOCAL (CORS/CSP)
  // Aceita requisições de qualquer interface local
  allowedDevOrigins: [
    '192.168.15.87',
    '192.168.15.87:*',
    '192.168.15.48',
    '192.168.15.48:*',
    '192.168.15.86',
    '192.168.15.86:*',
    '192.168.15.50',
    '192.168.15.50:*',
    'localhost',
    'localhost:*',
    '127.0.0.1',
    '127.0.0.1:*'
  ],

  // GARANTE QUE STATIC ASSETS FUNCIONEM MESMO VIA REDE
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          },
        ],
      },
    ];
  },
};

export default nextConfig;