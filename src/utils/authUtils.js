import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const createUserDocument = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userData = {
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    createdAt: new Date(), // Data di registrazione
    registrationEmail: user.email, // Email usata per la registrazione
  };

  try {
    await setDoc(userRef, userData);
    console.log("User document created successfully with email:", user.email);
  } catch (error) {
    console.error("Error creating user document:", error);
  }
};