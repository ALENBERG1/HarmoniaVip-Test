import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithCustomToken } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { verifyTelegramData } from '@/lib/telegramAuth';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  marketing: {
    username: 'marketing@test.com',
    password: 'marketing123',
    config: {
      telegramId: 'marketing_demo',
      username: 'Marketing Demo',
      plan: 'free',
      isDemoUser: true,
      allowedPages: ['/marketing'],
    },
  },
  development: {
    username: 'dev@test.com',
    password: 'dev123',
    config: {
      telegramId: 'dev_demo',
      username: 'Development Demo',
      plan: 'free',
      isDemoUser: true,
      allowedPages: ['/development'],
    },
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await handleUserLogin(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Funzione per gestire l'accesso utente da Firebase
  const handleUserLogin = async (firebaseUser) => {
    try {
      const telegramId = firebaseUser.uid.replace('telegram:', '');
      const userDoc = await getDoc(doc(db, 'users', telegramId));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          ...firebaseUser,
          ...userData,
          telegramId,
          hasValidPlan: Boolean(userData.plan) || isPremiumTelegramUser(telegramId),
        });
      } else {
        const mongoData = await fetchMongoUserData(telegramId);
        if (mongoData) {
          await setDoc(doc(db, 'users', telegramId), {
            ...mongoData,
            telegramId: mongoData.id,
            lastLogin: serverTimestamp(),
          });
          setUser({
            ...firebaseUser,
            ...mongoData,
            hasValidPlan: Boolean(mongoData.plan) || isPremiumTelegramUser(telegramId),
          });
        } else {
          console.error("User document not found after login for ID:", telegramId);
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  // Funzione per verificare se un utente Telegram ha un piano valido
  const isPremiumTelegramUser = (telegramId) =>
    telegramId === '402570623' || telegramId === '6868138640';

  // Funzione di login tramite bottone Telegram
  const login = async (telegramData) => {
    try {
      const verifiedUser = await verifyTelegramData(telegramData);
      await handleUserLogin(verifiedUser);
      return verifiedUser;
    } catch (error) {
      console.error("Error in Telegram login:", error);
      throw error;
    }
  };

  // Funzione per ottenere i dati dell'utente da MongoDB
  const fetchMongoUserData = async (telegramId) => {
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
      console.error("Error fetching user data from MongoDB:", error);
      return null;
    }
  };

  // Funzione di logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  // Funzione per aggiornare il piano dell'utente
  const updateUserPlan = async (newPlan) => {
    if (user && user.telegramId) {
      try {
        await setDoc(doc(db, 'users', user.telegramId), { plan: newPlan }, { merge: true });
        setUser((prevUser) => ({
          ...prevUser,
          plan: newPlan,
          hasValidPlan: Boolean(newPlan) || isPremiumTelegramUser(user.telegramId),
        }));
      } catch (error) {
        console.error("Error updating user plan:", error);
        throw error;
      }
    }
  };

// Funzione di login tramite Telegram WebApp
const loginWithTelegramData = async (token, userData) => {
  try {
    // Autentica l'utente con il token personalizzato ricevuto
    await signInWithCustomToken(auth, token);

    // Imposta i dati dell'utente autenticato
    setUser(userData);
  } catch (error) {
    console.error("Error during Telegram WebApp login:", error);
    throw error;
  }
};


  // Funzione di login per account demo
  const handleDemoLogin = async (demoCredentials) => {
    try {
      const account = Object.values(DEMO_ACCOUNTS).find(
        (acc) => acc.username === demoCredentials.username && acc.password === demoCredentials.password
      );

      if (!account) {
        throw new Error('Invalid demo credentials');
      }

      await setDoc(
        doc(db, 'users', account.config.telegramId),
        account.config,
        { merge: true }
      );

      setUser(account.config);
      return account.config;
    } catch (error) {
      console.error("Error in demo login:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    loginWithTelegramData,
    logout,
    updateUserPlan,
    handleDemoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);