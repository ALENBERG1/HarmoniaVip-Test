import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export default async function handler(req, res) {
  // Verifica del metodo
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Recupero e verifica del token API
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ message: 'Access forbidden: invalid API token' });
  }

  // Estrarre i dati dal corpo della richiesta
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ message: 'Invalid request: chatId and message are required.' });
  }

  try {
    // Invio del messaggio a Telegram
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Supporta HTML per la formattazione del messaggio
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Errore Telegram:', data);
      return res.status(500).json({ message: `Errore nell'invio del messaggio a Telegram: ${data.description}` });
    }

    res.status(200).json({ message: 'Messaggio inviato con successo' });
  } catch (error) {
    console.error('Errore invio messaggio:', error);
    res.status(500).json({ message: 'Errore durante l\'invio del messaggio' });
  }
}
