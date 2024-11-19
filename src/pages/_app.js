import { useEffect } from "react";
import "@/styles/globals.css";
import { AuthProvider } from "../context/AuthContext"; // Usa solo AuthProvider qui, non usare `useAuth`
import Head from "next/head";
import { useRouter } from "next/router";
import AuthenticateWithTelegram from "../components/AuthenticateWithTelegram"; // Crea questo componente

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Harmonya Manager Platform</title>
        <meta name="description" content="Gestisci il tuo calendario e note" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </Head>
      <AuthenticateWithTelegram /> {/* Questo componente si occupa dell'autenticazione Telegram */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}