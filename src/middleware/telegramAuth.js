// middleware/telegramAuth.js
import crypto from 'crypto';
import { auth } from '../lib/firebase-admin';

export const telegramAuthMiddleware = async (req, res, callback) => {
  try {
    const { tgWebAppData } = req.body;
    if (!tgWebAppData) return callback();

    const data = JSON.parse(Buffer.from(tgWebAppData, 'base64').toString());
    const { user, auth_date, hash } = data;
    const currentTime = Math.floor(Date.now() / 1000);

    // Controllo se i dati di autenticazione sono scaduti
    if (currentTime - auth_date > 86400) {
      return res.status(401).json({ error: 'Authentication data expired' });
    }

    const secretKey = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest();
    const dataCheckString = Object.keys(data).filter((k) => k !== 'hash').sort().map((k) => `${k}=${data[k]}`).join('\n');
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    // Confronta il valore hash calcolato con quello fornito
    if (calculatedHash !== hash) {
      return res.status(401).json({ error: 'Invalid authentication data' });
    }

    // Crea un token personalizzato per Firebase Auth
    const customToken = await auth.createCustomToken(`telegram:${user.id}`);
    req.telegramAuth = { token: customToken, userId: user.id };
    
    // Chiama la funzione callback per continuare l'elaborazione
    await callback();
  } catch (error) {
    console.error('Error in Telegram auth middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};