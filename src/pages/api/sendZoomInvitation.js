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
  const { chatId, title, date, time, url } = req.body;

  if (!chatId || !title || !date || !time || !url) {
    return res.status(400).json({ message: 'Invalid request: chatId, title, date, time, and url are required.' });
  }

  const message = `🌟 <b>${title}</b> 🌟

Siamo entusiasti di invitarvi al nostro prossimo webinar!

📅 <b>Data:</b> ${date}  
🕚 <b>Orario:</b> ${time}

Non vediamo l'ora di condividere con voi tutte le novità di Harmonya e di rispondere alle vostre domande. 🚀

💬 <i>Clicca sul pulsante qui sotto per accedere al Webinar!</i>`;

  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Utilizza HTML per la formattazione
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔗 Accedi al Webinar",
                url: url,
              }
            ]
          ]
        }
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
