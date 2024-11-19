// src/lib/telegramAuth.js
import { signInWithCustomToken } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';

const TELEGRAM_BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;

export const verifyTelegramData = async (telegramData) => {
  try {
    const response = await fetch('/api/verify-telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': process.env.NEXT_PUBLIC_API_SECRET_TOKEN, // Aggiungi il token API
      },
      body: JSON.stringify(telegramData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Verification failed');
    }

    const { token } = await response.json();

    const userCredential = await signInWithCustomToken(auth, token);

    const telegramId = String(telegramData.id || '');
    if (!telegramId) {
      throw new Error('Invalid Telegram ID');
    }

    const userRef = doc(db, 'users', telegramId);
    const userSnapshot = await getDoc(userRef);

    const userData = {
      telegramId: telegramId,
      lastLogin: serverTimestamp(),
    };

    if (telegramData.first_name) userData.firstName = telegramData.first_name;
    if (telegramData.username) userData.username = telegramData.username;
    if (telegramData.photo_url) userData.photoURL = telegramData.photo_url;

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });

      const subcollections = ['appointments', 'notes', 'documents'];
      for (const subcollection of subcollections) {
        const subcollectionRef = collection(userRef, subcollection);
        await setDoc(doc(subcollectionRef, 'placeholder'), {
          placeholder: true,
          createdAt: serverTimestamp()
        });
      }

      console.log("New user created with ID:", telegramId);
    } else {
      await setDoc(userRef, userData, { merge: true });
      console.log("Existing user updated:", telegramId);
    }

    return {
      ...userCredential.user,
      ...userData
    };
  } catch (error) {
    console.error('Error in Telegram authentication:', error);
    throw error;
  }
};

export const getTelegramLoginButton = () => {
  if (typeof window !== 'undefined') {
    window.TelegramLoginWidget = {
      dataOnauth: (user) => verifyTelegramData(user)
    };
  }

  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login', TELEGRAM_BOT_NAME);
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
  script.setAttribute('data-request-access', 'write');

  return script;
};