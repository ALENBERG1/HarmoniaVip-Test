import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const AuthenticateWithTelegram = () => {
  const router = useRouter();
  const { user, loginWithTelegramData } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      if (user || isAuthenticating) return; // Se l'utente è già autenticato o è in fase di autenticazione, esci

      try {
        setIsAuthenticating(true); // Imposta l'autenticazione in corso
        const tg = window.Telegram?.WebApp;

        // Verifica che `tg` e `tg.initData` siano presenti
        if (tg && tg.initData) {
          const tgWebAppData = tg.initData;
          tg.expand();

          console.log("Sending tgWebAppData:", tgWebAppData);

          // Invia la richiesta di autenticazione
          const response = await fetch('/api/auth/telegram-webapp-auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
            },
            body: JSON.stringify({ tgWebAppData }),
          });

          if (!response.ok) {
            throw new Error("Authentication failed with Telegram WebApp");
          }

          const { token, user: userData } = await response.json();

          // Esegue il login con il token ricevuto
          await loginWithTelegramData(token, userData);
          router.push("/"); // Reindirizza alla dashboard
        } else {
          console.warn("Telegram WebApp initData is missing.");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      } finally {
        setIsAuthenticating(false); // Rilascia l'autenticazione in corso
      }
    };

    authenticate();
  }, [router, loginWithTelegramData, user, isAuthenticating]);

  return null; 
};

export default AuthenticateWithTelegram;