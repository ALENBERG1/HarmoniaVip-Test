require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');
const { MongoClient } = require('mongodb');

// Configurazione Firebase Web SDK
const firebaseConfig = {
  apiKey: "AIzaSyC89deKsChwQxZAT0vNCyt25zWadDzs4NI",
  authDomain: "calendarapp-9aedb.firebaseapp.com",
  projectId: "calendarapp-9aedb",
  storageBucket: "calendarapp-9aedb.appspot.com",
  messagingSenderId: "990018260933",
  appId: "1:990018260933:web:1857d0911d093db103c5ac"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configurazione MongoDB, utilizzando l'URI dall'env
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI non è definito. Verifica il file .env.");
  process.exit(1);
}

const mongoClient = new MongoClient(mongoUri);

async function syncParentIdWithFirebase() {
  try {
    // Connessione a MongoDB
    await mongoClient.connect();
    const mongoDb = mongoClient.db('database'); // Nome database come fornito
    const mongoCollection = mongoDb.collection('user'); // Nome collezione come fornito

    // Recupera tutti gli utenti da Firebase
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    if (snapshot.empty) {
      console.log('Nessun utente trovato nella collezione Firebase.');
      return;
    }

    for (const userDoc of snapshot.docs) {
      const firebaseData = userDoc.data();
      const userId = firebaseData.id;

      // Cerca l'utente corrispondente in MongoDB usando l'id di Firebase
      const mongoUser = await mongoCollection.findOne({ id: userId });

      if (mongoUser && mongoUser.parent_id) { // Verifica la presenza di `parent_id`
        const userRef = doc(db, 'users', userDoc.id);

        // Controlla e aggiorna `parent_id` solo se è differente o assente in Firebase
        if (firebaseData.parent_id !== mongoUser.parent_id) {
          try {
            await updateDoc(userRef, { parent_id: mongoUser.parent_id });
            console.log(`Aggiornato parent_id per utente Firebase con ID: ${userDoc.id}`);
          } catch (error) {
            console.error(`Errore durante l'aggiornamento del campo parent_id per utente Firebase con ID: ${userDoc.id}`, error);
          }
        } else {
          console.log(`parent_id già presente o uguale per utente Firebase con ID: ${userDoc.id}`);
        }
      } else {
        console.log(`Utente con ID ${userId} non trovato in MongoDB o privo di parent_id.`);
      }
    }

    console.log('Sincronizzazione completata: campo parent_id aggiornato per gli utenti Firebase esistenti.');
  } catch (error) {
    console.error("Errore durante la sincronizzazione:", error);
  } finally {
    await mongoClient.close();
  }
}

syncParentIdWithFirebase().catch((error) => {
  console.error("Errore durante la sincronizzazione:", error);
});