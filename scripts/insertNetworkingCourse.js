// scripts/insertNetworkingCourse.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyC89deKsChwQxZAT0vNCyt25zWadDzs4NI",
    authDomain: "calendarapp-9aedb.firebaseapp.com",
    projectId: "calendarapp-9aedb",
    storageBucket: "calendarapp-9aedb.appspot.com",
    messagingSenderId: "990018260933",
    appId: "1:990018260933:web:1857d0911d093db103c5ac"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const networkingCourse = {
  title: "Fondamenti di Networking",
  description: "Un corso introduttivo per comprendere i principi base delle reti informatiche e del networking professionale.",
  lessons: [
    {
      id: "lesson1",
      title: "Introduzione al Networking",
      content: `
        <h2>Cos'è il Networking?</h2>
        <p>Il networking è l'arte di costruire e mantenere relazioni professionali. Nel mondo digitale, si riferisce anche alla connessione di dispositivi e sistemi informatici.</p>
        <h3>Importanza del Networking:</h3>
        <ul>
          <li>Opportunità di carriera</li>
          <li>Scambio di conoscenze</li>
          <li>Supporto professionale</li>
          <li>Innovazione e collaborazione</li>
        </ul>
      `,
      quiz: [
        {
          id: "q1l1",
          question: "Quale dei seguenti NON è un beneficio del networking?",
          options: [
            "Opportunità di carriera",
            "Isolamento professionale",
            "Scambio di conoscenze",
            "Supporto professionale"
          ],
          correctAnswer: "Isolamento professionale"
        }
      ]
    },
    {
      id: "lesson2",
      title: "Strategie di Networking Efficace",
      content: `
        <h2>Come Fare Networking Efficacemente</h2>
        <ol>
          <li>Sii autentico e genuino nelle tue interazioni</li>
          <li>Ascolta attivamente e mostra interesse negli altri</li>
          <li>Offri valore prima di chiedere favori</li>
          <li>Segui up dopo gli incontri iniziali</li>
          <li>Utilizza piattaforme online come LinkedIn per mantenere i contatti</li>
        </ol>
        <p>Ricorda: il networking di qualità si basa sulla costruzione di relazioni reciprocamente vantaggiose.</p>
      `,
      quiz: [
        {
          id: "q1l2",
          question: "Qual è un elemento chiave per un networking efficace?",
          options: [
            "Parlare solo di te stesso",
            "Ignorare i follow-up",
            "Offrire valore prima di chiedere favori",
            "Evitare l'uso di piattaforme online"
          ],
          correctAnswer: "Offrire valore prima di chiedere favori"
        }
      ]
    },
    {
      id: "lesson3",
      title: "Networking nell'Era Digitale",
      content: `
        <h2>Strumenti e Piattaforme per il Networking Digitale</h2>
        <ul>
          <li><strong>LinkedIn:</strong> La piattaforma professionale per eccellenza</li>
          <li><strong>Twitter:</strong> Ottimo per seguire thought leaders e partecipare a discussioni di settore</li>
          <li><strong>Meetup:</strong> Per trovare eventi e gruppi di interesse nella tua area</li>
          <li><strong>Slack:</strong> Comunità professionali e canali tematici</li>
        </ul>
        <p>Tip: Mantieni un profilo professionale coerente su tutte le piattaforme che utilizzi.</p>
      `,
      quiz: [
        {
          id: "q1l3",
          question: "Quale piattaforma è considerata la più importante per il networking professionale?",
          options: [
            "Facebook",
            "Instagram",
            "LinkedIn",
            "TikTok"
          ],
          correctAnswer: "LinkedIn"
        }
      ]
    }
  ]
};

async function insertCourse() {
  try {
    const docRef = await addDoc(collection(db, 'courses'), networkingCourse);
    console.log("Corso inserito con ID: ", docRef.id);
  } catch (e) {
    console.error("Errore nell'inserimento del corso: ", e);
  }
}

insertCourse();