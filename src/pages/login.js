import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { getTelegramLoginButton } from '../lib/telegramAuth';
import Link from 'next/link';
import { signInWithCustomToken } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();
  const telegramButtonRef = useRef(null);

  useEffect(() => {
    const checkUserInFirebase = async (telegramId) => {
      const userRef = doc(db, 'users', telegramId);
      const userSnapshot = await getDoc(userRef);
      return userSnapshot.exists() ? userSnapshot.data() : null;
    };

    const checkUserInMongo = async (telegramId) => {
      try {
        const response = await fetch('/api/checkUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
          },
          body: JSON.stringify({ telegramId }),
        });
        const data = await response.json();
        return data.exists ? data.user : null;
      } catch (error) {
        console.error("Errore durante il controllo dell'utente in MongoDB:", error);
        return null;
      }
    };

    const handleTelegramAuth = async (telegramData) => {
      const telegramId = String(telegramData.id);
    
      const firebaseUser = await checkUserInFirebase(telegramId);
      if (firebaseUser) {
        try {
          const tokenResponse = await fetch('/api/generateCustomToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
            },
            body: JSON.stringify({ telegramId }),
          });
    
          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            throw new Error(`Errore nella richiesta: ${errorText || 'Risposta non valida dal server'}`);
          }
    
          const tokenData = await tokenResponse.json();
          if (!tokenData.customToken) {
            throw new Error("Token non presente nella risposta dell'API.");
          }
    
          await signInWithCustomToken(auth, tokenData.customToken);
          router.push('/');
        } catch (error) {
          console.error("Errore durante l'autenticazione con Firebase:", error);
          alert("Errore durante l'accesso. Contatta l'amministratore.");
        }
        return;
      }
    
      const mongoUser = await checkUserInMongo(telegramId);
      if (mongoUser) {
        const newUserData = {
          id: mongoUser.id,
          telegramId: mongoUser.id,
          createdAt: mongoUser.created_at,
          isManager: mongoUser.is_manager,
          parent_id: mongoUser.parent_id,
          plan: mongoUser.plan,
          username: mongoUser.username,
          lastLogin: serverTimestamp(),
          firstName: telegramData.first_name || null,
          photoURL: telegramData.photo_url || null,
        };
    
        const userRef = doc(db, 'users', telegramId);
        await setDoc(userRef, newUserData);
    
        try {
          const tokenResponse = await fetch('/api/generateCustomToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
            },
            body: JSON.stringify({ telegramId }),
          });
    
          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            throw new Error(`Errore nella richiesta: ${errorText || 'Risposta non valida dal server'}`);
          }
    
          const tokenData = await tokenResponse.json();
          if (!tokenData.customToken) {
            throw new Error("Token non presente nella risposta dell'API.");
          }
    
          await signInWithCustomToken(auth, tokenData.customToken);
          router.push('/');
        } catch (error) {
          console.error("Errore durante l'autenticazione con Firebase per il nuovo utente:", error);
          alert("Errore durante l'accesso. Contatta l'amministratore.");
        }
      } else {
        alert("Utente non registrato su Harmonya. Contatta l'amministratore.");
      }
    };

    if (user) {
      router.push('/');
    } else {
      const script = getTelegramLoginButton(handleTelegramAuth);
      if (telegramButtonRef.current) {
        telegramButtonRef.current.innerHTML = '';
        telegramButtonRef.current.appendChild(script);
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C0C0C] text-[#F0EDE5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <Link href="/">
          <img
            className="h-24 w-80"
            src="/NETWORKINGPLATFORM.png"
            alt="Harmonia Logo"
          />
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#1D1D1D] rounded-lg shadow-lg p-8 space-y-8">
        <h2 className="text-center text-3xl font-bold">Benvenuto in Harmonya Manager Platform</h2>
        <p className="text-center text-sm text-[#A1A0A0]">
          Accedi per gestire appuntamenti, webinar, documenti e tanto altro.
        </p>

        <div ref={telegramButtonRef} className="flex justify-center mt-6"></div>

        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#3E3E3E]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1D1D1D] text-[#A1A0A0]">O accedi con la Web App</span>
          </div>
        </div>

        <div className="text-center text-sm text-[#F0EDE5] mt-4">
          <p>All'interno troverai:</p>
          <ul className="list-disc list-inside text-[#D4AF37] mt-2 space-y-1">
            <li>Calendario e gestione appuntamenti avanzata</li>
            <li>Accesso a webinar e sessioni esclusive</li>
            <li>Documenti condivisi, forum e note</li>
            <li>Formazione continua e networking</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-[#A1A0A0] space-y-4">
        <p>Seguici sui nostri canali social:</p>
        <div className="flex justify-center space-x-4">
          <a href="https://www.facebook.com/harmonia" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">
            <i className="fab fa-facebook fa-lg"></i>
          </a>
          <a href="https://www.instagram.com/harmonia" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">
            <i className="fab fa-instagram fa-lg"></i>
          </a>
          <a href="https://twitter.com/harmonia" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">
            <i className="fab fa-twitter fa-lg"></i>
          </a>
          <a href="https://www.linkedin.com/company/harmonia" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37]">
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
        </div>

        <div className="mt-8">
          <p>Bot Telegram:</p>
          <div className="flex justify-center space-x-4">
            <a href="https://t.me/Harmonyaclub_bot" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#A37E2B]">
              <i className="fab fa-telegram fa-lg mr-2"></i> @Harmonyaclub_bot
            </a>
            <a href="https://t.me/harmonyavip_bot" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#A37E2B]">
              <i className="fab fa-telegram fa-lg mr-2"></i> @harmonyavip_bot
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-[#A1A0A0] italic max-w-6xl px-4">
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
          <p>
            © 2024 Harmonya. L'investimento in criptovalute, metalli preziosi e prodotti finanziari comporta rischi significativi, inclusa la possibile perdita del capitale investito. I rendimenti passati non sono indicativi di risultati futuri. Le informazioni fornite non costituiscono consulenza finanziaria, fiscale o legale. Prima di prendere qualsiasi decisione di investimento, si consiglia di consultare un professionista qualificato. Harmonya non garantisce l'accuratezza, la completezza o la tempestività delle informazioni fornite. È responsabilità dell'investitore valutare attentamente i rischi associati a ciascun investimento e verificare la conformità con le proprie circostanze finanziarie e obiettivi di investimento.
          </p>
          <p>
            Gli asset e i servizi presentati possono non essere disponibili in tutte le giurisdizioni e potrebbero essere soggetti a restrizioni normative locali. La partecipazione al club Harmonya non implica alcuna garanzia di profitto o rendimento. Ogni membro è responsabile delle proprie decisioni di investimento e dell'osservanza delle leggi e dei regolamenti applicabili nella propria giurisdizione. Harmonya non detiene, gestisce o controlla direttamente fondi dei membri. Tutte le transazioni e gli investimenti sono effettuati attraverso partner e fornitori di servizi regolamentati nelle rispettive giurisdizioni.
          </p>
        </div>
      </footer>
    </div>
  );
}
