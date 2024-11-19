// Usa l'SDK admin di Firebase
import { auth } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  // Verifica del metodo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Recupero e verifica del token API
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Access forbidden: invalid API token' });
  }

  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ error: 'telegramId is required' });
  }

  try {
    // Genera un token personalizzato utilizzando l'SDK Admin di Firebase
    const customToken = await auth.createCustomToken(`telegram:${telegramId}`);
    return res.status(200).json({ customToken });
  } catch (error) {
    console.error("Errore durante la generazione del token personalizzato:", error);
    return res.status(500).json({ error: 'Errore interno del server durante la generazione del token' });
  }
}
