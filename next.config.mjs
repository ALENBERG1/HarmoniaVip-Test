/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TELEGRAM_BOT_NAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN, // Token del bot Telegram per i servizi di autenticazione
    NEXT_PUBLIC_TELEGRAM_WEBAPP_URL: process.env.NEXT_PUBLIC_TELEGRAM_WEBAPP_URL, // URL della WebApp per i riferimenti interni
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://oauth.telegram.org https://web.telegram.org https://www.harmonya.vip;", // Aggiungi Telegram come sorgente permessa
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://web.telegram.org', // Consente alla WebApp di aprirsi in iframe su Telegram
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Abilita l'accesso da tutte le origini; se necessario, specifica le origini
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS', // Metodi permessi per le API
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization', // Intestazioni autorizzate
          },
        ],
      },
    ];
  },
};

export default nextConfig;