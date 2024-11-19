import crypto from 'crypto';
import { db } from '../../../lib/firebase-admin';
import fetch from 'node-fetch';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = process.env.BASE_URL;
const ALLOWED_ORIGINS = [
  "https://web.telegram.org",
  "https://oauth.telegram.org",
  "https://www.harmonya.vip"
];

export default async function handler(req, res) {
  // Verifica del metodo
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Recupero e verifica del token API
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ message: 'Access forbidden: invalid API token' });
  }

  const origin = req.headers.origin || req.headers.referer;
  if (!origin || !ALLOWED_ORIGINS.some((allowedOrigin) => origin.startsWith(allowedOrigin))) {
    return res.status(403).json({ message: 'Access forbidden: Invalid origin' });
  }

  const tgWebAppData = req.body.tgWebAppData;

  if (!tgWebAppData) {
    return res.status(400).json({ message: 'Missing tgWebAppData' });
  }

  try {
    // Verifica `tgWebAppData` utilizzando la funzione `verifyHMACData`
    const { isValid, userId, parsedData, error } = verifyHMACData(tgWebAppData);
    if (!isValid || !userId) {
      console.error("Errore nella verifica dei dati Telegram:", error);
      return res.status(403).json({ message: 'Invalid Telegram WebApp data' });
    }

    const userIdString = String(userId);

    // Controlla se l'utente esiste su Firebase
    let userDoc = await db.collection('users').doc(userIdString).get();
    let userData;

    if (userDoc.exists) {
      userData = userDoc.data();
    } else {
      const mongoUserData = await fetchUserFromMongoDB(userIdString);
      if (!mongoUserData) {
        return res.status(404).json({ message: 'User not registered' });
      }

      userData = {
        telegramId: mongoUserData.id,
        createdAt: mongoUserData.created_at,
        isManager: mongoUserData.is_manager,
        parent_id: mongoUserData.parent_id,
        plan: mongoUserData.plan,
        username: mongoUserData.username,
        lastLogin: new Date().toISOString(),
      };

      await db.collection('users').doc(userIdString).set(userData);
    }

    const customToken = await generateCustomToken(userIdString);

    return res.status(200).json({ token: customToken, user: userData, initData: parsedData });
  } catch (error) {
    console.error('Error in Telegram WebApp auth:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Funzione per verificare initData come firma HMAC-SHA256
function verifyHMACData(initData) {
  // Crea la chiave segreta per HMAC utilizzando `BOT_TOKEN`
  const secretKey = crypto.createHmac('sha256', "WebAppData").update(BOT_TOKEN).digest();

  const params = new URLSearchParams(initData);
  const data = {};
  for (const [key, value] of params) {
    data[key] = value;
  }

  const { hash, auth_date, user } = data;
  if (!hash || !auth_date || !user) {
    return { isValid: false, userId: null, parsedData: null, error: 'Missing hash, auth_date, or user' };
  }

  // Costruisce la `dataCheckString` ordinando i parametri e concatenandoli
  const dataCheckString = Object.keys(data)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${decodeURIComponent(data[key])}`)
    .join('\n');

  // Calcola l'hash atteso usando `crypto.createHmac` con la `secretKey`
  const expectedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const isValid = hash === expectedHash;

  let userId;
  let parsedData = null;
  try {
    parsedData = JSON.parse(decodeURIComponent(user));
    userId = parsedData.id;
  } catch (error) {
    return { isValid: false, userId: null, parsedData: null, error: 'User data parsing error' };
  }

  return { isValid, userId, parsedData, error: isValid ? null : 'Hash mismatch' };
}

// Funzione per recuperare l'utente da MongoDB
async function fetchUserFromMongoDB(telegramId) {
  try {
    const response = await fetch(`${BASE_URL}/api/checkUser`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-token': process.env.API_SECRET_TOKEN,
      },
      body: JSON.stringify({ telegramId }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.exists ? data.user : null;
  } catch (error) {
    return null;
  }
}

// Funzione per generare un token personalizzato per Firebase
async function generateCustomToken(telegramId) {
  try {
    const response = await fetch(`${BASE_URL}/api/generateCustomToken`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-token': process.env.API_SECRET_TOKEN,
      },
      body: JSON.stringify({ telegramId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate custom token`);
    }

    const { customToken } = await response.json();
    return customToken;
  } catch (error) {
    throw error;
  }
}
