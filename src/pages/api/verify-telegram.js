// pages/api/verify-telegram.js
import crypto from 'crypto';
import { auth } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  // Verifica del metodo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Recupera il token API dal client
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  // Verifica del token API
  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Access forbidden: invalid API token' });
  }

  const { hash, ...data } = req.body;

  // Generazione del segreto per Telegram
  const secret = crypto.createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();

  // Creazione della stringa di controllo
  const checkString = Object.keys(data)
    .sort()
    .map(k => `${k}=${data[k]}`)
    .join('\n');

  // Calcolo dell'HMAC per la validazione
  const hmac = crypto.createHmac('sha256', secret)
    .update(checkString)
    .digest('hex');

  if (hmac !== hash) {
    return res.status(400).json({ error: 'Invalid authentication data' });
  }

  // Verifica che i dati di autenticazione non siano più vecchi di 24 ore
  const authDate = parseInt(data.auth_date, 10);
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - authDate > 86400) {
    return res.status(400).json({ error: 'Authentication data expired' });
  }

  try {
    // Creazione di un token personalizzato con claim aggiuntivi
    const uid = `telegram:${data.id}`;
    const additionalClaims = {
      telegramId: data.id,
      firstName: data.first_name,
      username: data.username,
    };
    const customToken = await auth.createCustomToken(uid, additionalClaims);

    res.status(200).json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}