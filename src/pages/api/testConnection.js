import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  // Recupera il token di accesso dalla richiesta
  const token = req.headers['x-api-token'];
  const { API_SECRET_TOKEN } = process.env;

  // Verifica del token di accesso
  if (token !== API_SECRET_TOKEN) {
    return res.status(403).json({ message: 'Access forbidden' });
  }

  try {
    const db = await connectToDatabase();
    // Ottiene l'elenco delle collezioni nel database
    const collections = await db.listCollections().toArray();

    // Risponde con un messaggio di successo e le collezioni disponibili
    return res.status(200).json({ 
      message: 'Connected to MongoDB successfully', 
      collections 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: 'Failed to connect to MongoDB' });
  }
}