export default async function handler(req, res) {
  // Accetta sia GET che POST per facilitare l'impostazione
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Recupero e verifica del token API
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Access forbidden: invalid API token' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const WEBHOOK_URL = `https://www.harmonya.vip/api/telegram/webhook`;
  const SECRET_TOKEN = Math.random().toString(36).slice(2); // Token segreto per il webhook

  try {
    // Rimuovi il webhook esistente
    const deleteResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    const deleteData = await deleteResponse.json();

    if (!deleteData.ok) {
      console.error('Errore nella rimozione del webhook:', deleteData.description);
      return res.status(400).json({ success: false, error: deleteData.description });
    }

    // Imposta il nuovo webhook
    const setResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          secret_token: SECRET_TOKEN,
          allowed_updates: ['message', 'callback_query'],
        }),
      }
    );

    const setData = await setResponse.json();

    if (setData.ok) {
      // Salva il secret token in qualche modo sicuro 
      res.status(200).json({ success: true, message: 'Webhook set successfully', secretToken: SECRET_TOKEN });
    } else {
      console.error('Errore nell\'impostazione del webhook:', setData.description);
      res.status(400).json({ success: false, error: setData.description });
    }
  } catch (error) {
    console.error('Error setting webhook:', error);
    res.status(500).json({ success: false, error: 'Failed to set webhook' });
  }
}
