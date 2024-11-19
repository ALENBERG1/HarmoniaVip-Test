import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // Verifica del metodo
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Recupero e verifica del token API
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ error: 'Access forbidden: invalid API token' });
  }

  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ error: 'Telegram ID is required' });
  }

  try {
    const client = new MongoClient(mongoUri); // Connessione al client MongoDB
    await client.connect();
    const database = client.db('database'); // Nome del tuo database MongoDB
    const usersCollection = database.collection('user'); // Nome della tua collezione

    // Ricerca dell'utente in base a telegramId
    const user = await usersCollection.findOne({ id: telegramId.toString() });
    await client.close();

    if (user) {
      // Se l'utente esiste, escludi `wallet` e `_id` dalla risposta
      const { wallet, _id, ...filteredUser } = user;
      return res.status(200).json({ exists: true, user: filteredUser });
    } else {
      return res.status(404).json({ exists: false, message: "User not found in MongoDB" });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
}