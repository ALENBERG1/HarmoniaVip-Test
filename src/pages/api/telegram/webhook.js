import crypto from 'crypto';
import { db } from '../../../lib/firebase-admin';
import { connectToDatabase } from '../../../lib/mongodb';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  // Verifica del metodo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Recupero e verifica del token API
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Access forbidden: invalid API token' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const chatId = message.chat.id.toString();
    const command = message.text;

    if (command === '/start') {
      // Verifica l'utente in Firebase
      const userRef = db.collection('users').doc(chatId);
      const firebaseUser = await userRef.get();

      if (firebaseUser.exists) {
        // L'utente esiste già in Firebase
        const initData = generateInitData(chatId);
        const webAppUrl = `https://harmonya.vip/`;
        const welcomeMessage = firebaseUser.data().isManager
          ? 'Benvenuto! Hai accesso completo alla piattaforma. Clicca sul pulsante per accedere alla dashboard.'
          : 'Benvenuto! Hai accesso alla dashboard di base. Per sbloccare tutte le funzionalità, contatta l\'amministratore.';

        await sendTelegramMessage(chatId, welcomeMessage, {
          inline_keyboard: [[
            {
              text: '🚀 Apri Dashboard',
              web_app: { url: webAppUrl }
            }
          ]]
        });
      } else {
        // L'utente non è presente in Firebase, verifica su MongoDB
        const mongoUser = await checkUserInMongo(chatId);

        if (mongoUser) {
          // L'utente è presente su MongoDB, crea il record su Firebase
          await userRef.set({
            id: mongoUser.id,
            telegramId: mongoUser.id, // Aggiungi telegramId uguale a id di MongoDB
            createdAt: mongoUser.created_at,
            isManager: mongoUser.is_manager,
            parent_id: mongoUser.parent_id,
            plan: mongoUser.plan,
            username: mongoUser.username,
            lastLogin: new Date(),
          });

          // Invia messaggio di benvenuto con pulsante per aprire la dashboard
          const initData = generateInitData(chatId);
          const webAppUrl = `https://harmonya.vip/`;
          const welcomeMessage = mongoUser.is_manager
            ? 'Benvenuto! Hai accesso completo alla piattaforma. Clicca sul pulsante per accedere alla dashboard.'
            : 'Benvenuto! Hai accesso alla dashboard di base. Per sbloccare tutte le funzionalità, contatta l\'amministratore.';

          await sendTelegramMessage(chatId, welcomeMessage, {
            inline_keyboard: [[
              {
                text: '🚀 Apri Dashboard',
                web_app: { url: webAppUrl }
              }
            ]]
          });
        } else {
          // L'utente non è presente su MongoDB
          await sendTelegramMessage(
            chatId,
            'Spiacente, non sei registrato sull\'app Harmonya. Contatta l\'amministratore per assistenza.'
          );
        }
      }
    }

    res.status(200).end();
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Funzione per verificare se l'utente è presente su MongoDB
async function checkUserInMongo(telegramId) {
  try {
    const db = await connectToDatabase();
    const user = await db.collection('user').findOne({ id: telegramId });
    return user;
  } catch (error) {
    console.error("Error checking user in MongoDB:", error);
    return null;
  }
}

// Funzione per inviare un messaggio su Telegram
async function sendTelegramMessage(chatId, text, reply_markup = null) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    ...(reply_markup && { reply_markup })
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return response.json();
}

// Funzione per generare `tgWebAppData` in base a `chatId`
function generateInitData(chatId) {
  const payload = JSON.stringify({ id: chatId });
  const base64Payload = Buffer.from(payload).toString('base64url');

  const signature = crypto
    .createHmac('sha256', BOT_TOKEN)
    .update(`${chatId}.${base64Payload}`)
    .digest('base64url');

  return `${chatId}.${base64Payload}.${signature}`;
}
