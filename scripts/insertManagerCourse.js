// scripts/insertManagerCourse.js
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  doc, 
  serverTimestamp 
} = require('firebase/firestore');

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

const managerCourse = {
  title: "Corso per Manager di Harmonya: Networking e Mindset",
  description: "Corso completo per diventare un Manager di successo in Harmonya, focalizzato sullo sviluppo di competenze di networking, leadership e gestione della community.",
  lessons: [
    // MODULO 1: Introduzione al Ruolo del Manager in Harmonya
    {
      id: "m1l1",
      title: "Il Ruolo del Manager in Harmonya",
      content: `
        <h2>Panoramica sulla visione e gli obiettivi di Harmonya</h2>
        <p>Harmonya rappresenta una rivoluzione nel modo di concepire il networking e le opportunità di investimento. Come Manager, sarai al centro di questa trasformazione.</p>

        <h3>Creazione di una Community Inclusiva</h3>
        <ul>
          <li>Favorire un ambiente collaborativo e di supporto reciproco</li>
          <li>Promuovere la diversità e l'inclusione all'interno della community</li>
          <li>Facilitare la condivisione di conoscenze ed esperienze</li>
        </ul>

        <h3>Valore del Frazionamento degli Asset</h3>
        <p>Il frazionamento democratizza l'accesso a opportunità di investimento esclusive, permettendo a più persone di partecipare a progetti di alto valore.</p>

        <h3>Responsabilità Principali</h3>
        <ol>
          <li>Invito e onboarding di nuovi membri:
            <ul>
              <li>Identificare potenziali membri qualificati</li>
              <li>Presentare efficacemente i benefici di Harmonya</li>
              <li>Guidare i nuovi membri nel processo di registrazione</li>
            </ul>
          </li>
          <li>Monitoraggio e supporto del team:
            <ul>
              <li>Tracciare i progressi degli utenti VIP</li>
              <li>Fornire supporto e mentorship continua</li>
              <li>Risolvere problematiche e dubbi</li>
            </ul>
          </li>
          <li>Promozione attiva:
            <ul>
              <li>Condividere opportunità in modo trasparente</li>
              <li>Organizzare eventi e sessioni informative</li>
              <li>Mantenere una comunicazione costante con il team</li>
            </ul>
          </li>
        </ol>
      `,
      quiz: [
        {
          id: "q1m1l1",
          question: "Quale tra questi NON è un compito principale del Manager Harmonya?",
          options: [
            "Invitare nuovi membri",
            "Gestire direttamente gli investimenti dei membri",
            "Monitorare i progressi del team",
            "Promuovere opportunità"
          ],
          correctAnswer: "Gestire direttamente gli investimenti dei membri"
        }
      ]
    },
    {
      id: "m1l2",
      title: "Benefici e Ricompense del Manager",
      content: `
        <h2>Vantaggi Esclusivi del Ruolo Manager</h2>
        
        <h3>Sistema di Ricompense</h3>
        <p>Come Manager, avrai accesso a un sistema di ricompense multilivello basato sulle performance della tua rete:</p>
        <ul>
          <li>Ricompense dirette sulle vendite personali</li>
          <li>Bonus sulla performance del team</li>
          <li>Incentivi per il raggiungimento di obiettivi mensili</li>
          <li>Commissioni ricorrenti sulle attività della rete</li>
        </ul>

        <h3>Accesso Esclusivo</h3>
        <p>Il ruolo di Manager offre accesso privilegiato a:</p>
        <ul>
          <li>Eventi VIP e masterclass esclusive</li>
          <li>Formazione avanzata e aggiornamenti continui</li>
          <li>Network di professionisti e investitori di alto livello</li>
          <li>Anteprima su nuove opportunità di investimento</li>
        </ul>

        <h3>Riconoscimenti e Status</h3>
        <ul>
          <li>Badge esclusivi sulla piattaforma</li>
          <li>Riconoscimenti pubblici per risultati eccezionali</li>
          <li>Possibilità di partecipare come speaker agli eventi</li>
          <li>Status privilegiato nella community</li>
        </ul>
      `,
      quiz: [
        {
          id: "q1m1l2",
          question: "Quale beneficio caratterizza maggiormente il ruolo di Manager?",
          options: [
            "Stipendio fisso mensile",
            "Ricompense basate sulle performance della rete",
            "Accesso illimitato ai fondi aziendali",
            "Gestione diretta del portafoglio aziendale"
          ],
          correctAnswer: "Ricompense basate sulle performance della rete"
        }
      ]
    },

    // MODULO 2: Networking Efficace
    {
      id: "m2l1",
      title: "L'Importanza del Networking",
      content: `
        <h2>Il Potere delle Connessioni nel Business</h2>
        <p>Il networking è la chiave per creare opportunità di crescita sostenibile sia per te che per la tua community.</p>

        <h3>Creazione di un Network di Valore</h3>
        <ul>
          <li>Identificare e connettere con partner strategici</li>
          <li>Costruire relazioni con aziende chiave nel settore</li>
          <li>Sviluppare un network di supporto reciproco</li>
        </ul>

        <h3>Networking per la Crescita Personale</h3>
        <ul>
          <li>Accesso a nuove prospettive e idee</li>
          <li>Opportunità di apprendimento continuo</li>
          <li>Sviluppo di soft skills attraverso le interazioni</li>
          <li>Costruzione di una reputazione solida nel settore</li>
        </ul>

        <h3>Costruire Relazioni Autentiche</h3>
        <p>Le relazioni di successo si basano su:</p>
        <ul>
          <li>Fiducia reciproca e trasparenza</li>
          <li>Valore aggiunto per entrambe le parti</li>
          <li>Comunicazione costante e sincera</li>
          <li>Impegno a lungo termine</li>
        </ul>
      `,
      quiz: [
        {
          id: "q2m2l1",
          question: "Quale elemento è fondamentale per costruire relazioni autentiche nel networking?",
          options: [
            "Focalizzarsi solo sul proprio guadagno",
            "Mantenere le relazioni superficiali",
            "Costruire fiducia reciproca",
            "Evitare la comunicazione frequente"
          ],
          correctAnswer: "Costruire fiducia reciproca"
        }
      ]
    },
    {
      id: "m2l2",
      title: "Tecniche di Networking per Manager di Harmonya",
      content: `
        <h2>Strategie per un Networking Efficace</h2>

        <h3>Essere Attivi nella Community</h3>
        <ul>
          <li>Partecipare regolarmente alle discussioni nei canali ufficiali</li>
          <li>Condividere conoscenze e insights di valore</li>
          <li>Rispondere prontamente alle domande dei membri</li>
          <li>Creare contenuti informativi e educativi</li>
        </ul>

        <h3>Sfruttare gli Eventi</h3>
        <p>Massimizzare le opportunità di networking durante:</p>
        <ul>
          <li>Webinar e seminari online</li>
          <li>Eventi in presenza di Harmonya</li>
          <li>Meetup della community</li>
          <li>Conferenze di settore</li>
        </ul>

        <h3>Comunicazione Efficace</h3>
        <ol>
          <li>Ascolto Attivo:
            <ul>
              <li>Prestare attenzione alle esigenze degli altri</li>
              <li>Fare domande pertinenti</li>
              <li>Mostrare genuino interesse</li>
            </ul>
          </li>
          <li>Empatia nelle Relazioni:
            <ul>
              <li>Comprendere le prospettive altrui</li>
              <li>Adattare il proprio approccio</li>
              <li>Offrire supporto quando necessario</li>
            </ul>
          </li>
        </ol>
      `,
      quiz: [
        {
          id: "q2m2l2",
          question: "Quale attività è più importante per un networking efficace su Harmonya?",
          options: [
            "Partecipare passivamente agli eventi",
            "Essere attivi e contribuire alle discussioni",
            "Evitare di condividere conoscenze",
            "Comunicare solo quando necessario"
          ],
          correctAnswer: "Essere attivi e contribuire alle discussioni"
        }
      ]
    },
    {
      id: "m2l3",
      title: "Utilizzare la Community Harmonya",
      content: `
        <h2>Massimizzare il Potenziale della Community</h2>

        <h3>Processo di Invito e Onboarding</h3>
        <ol>
          <li>Identificazione dei Potenziali Membri:
            <ul>
              <li>Valutare l'allineamento con i valori di Harmonya</li>
              <li>Considerare il potenziale di contributo alla community</li>
              <li>Verificare l'interesse genuino nelle opportunità</li>
            </ul>
          </li>
          <li>Processo di Invito:
            <ul>
              <li>Presentare i benefici in modo chiaro e trasparente</li>
              <li>Spiegare il funzionamento della piattaforma</li>
              <li>Condividere storie di successo concrete</li>
            </ul>
          </li>
          <li>Supporto Iniziale:
            <ul>
              <li>Guidare nel processo di registrazione</li>
              <li>Introdurre alle risorse disponibili</li>
              <li>Facilitare le prime interazioni nella community</li>
            </ul>
          </li>
        </ol>

        <h3>Collaborazione tra Manager</h3>
        <p>Strategie per la collaborazione efficace:</p>
        <ul>
          <li>Condivisione di best practices</li>
          <li>Organizzazione di eventi congiunti</li>
          <li>Supporto reciproco nelle iniziative</li>
          <li>Creazione di sinergie tra team diversi</li>
        </ul>
      `,
      quiz: [
        {
          id: "q2m2l3",
          question: "Qual è il primo passo cruciale nel processo di onboarding?",
          options: [
            "Raccogliere il pagamento",
            "Identificare membri allineati con i valori Harmonya",
            "Forzare l'iscrizione immediata",
            "Ignorare le domande iniziali"
          ],
          correctAnswer: "Identificare membri allineati con i valori Harmonya"
        }
      ]
    },

    // MODULO 3: Mindset per il Successo
    {
      id: "m3l1",
      title: "Il Mindset di Crescita",
      content: `
        <h2>Sviluppare una Mentalità Orientata alla Crescita</h2>

        <h3>Principi del Growth Mindset</h3>
        <ul>
          <li>Vedere le sfide come opportunità di apprendimento</li>
          <li>Abbracciare il cambiamento come costante</li>
          <li>Valorizzare il processo più del risultato</li>
          <li>Mantenere una curiosità continua</li>
        </ul>

        <h3>Apprendimento Continuo</h3>
        <p>Strategie per il miglioramento costante:</p>
        <ul>
          <li>Stabilire obiettivi di apprendimento regolari</li>
          <li>Cercare feedback costruttivi</li>
          <li>Sperimentare nuovi approcci</li>
          <li>Imparare dagli errori e dai successi</li>
        </ul>

        <h3>Sviluppare Resilienza</h3>
        <ol>
          <li>Gestione delle Sfide:
            <ul>
              <li>Accettare gli ostacoli come parte del percorso</li>
              <li>Sviluppare strategie di problem-solving</li>
              <li>Mantenere la prospettiva a lungo termine</li>
            </ul>
          </li>
          <li>Adattabilità al Cambiamento:
            <ul>
              <li>Essere flessibili nelle strategie</li>
              <li>Vedere le opportunità nei cambiamenti</li>
              <li>Aggiornare costantemente le proprie competenze</li>
            </ul>
          </li>
        </ol>
      `,
      quiz: [
        {
          id: "q3m3l1",
          question: "Quale caratteristica è fondamentale per un mindset di crescita?",
          options: [
            "Evitare le sfide",
            "Vedere gli errori come fallimenti",
            "Vedere le sfide come opportunità",
            "Mantenere le stesse strategie sempre"
          ],
          correctAnswer: "Vedere le sfide come opportunità"
        }
      ]
    },
    {
        id: "m3l2",
        title: "Leadership e Mentalità del Leader",
        content: `
          <h2>Caratteristiche di un Leader Efficace</h2>
  
          <h3>Fondamenti della Leadership</h3>
          <ul>
            <li>Visione chiara e ispiratrice
              <ul>
                <li>Capacità di comunicare obiettivi a lungo termine</li>
                <li>Abilità di ispirare e motivare gli altri</li>
                <li>Creazione di una direzione strategica</li>
              </ul>
            </li>
            <li>Integrità e coerenza
              <ul>
                <li>Mantenere standard etici elevati</li>
                <li>Agire in modo coerente con i valori dichiarati</li>
                <li>Essere un esempio per il team</li>
              </ul>
            </li>
            <li>Empowerment del team
              <ul>
                <li>Delegare responsabilità appropriate</li>
                <li>Supportare la crescita individuale</li>
                <li>Creare opportunità di sviluppo</li>
              </ul>
            </li>
          </ul>
  
          <h3>Processo Decisionale Consapevole</h3>
          <ol>
            <li>Analisi delle situazioni:
              <ul>
                <li>Raccolta di informazioni pertinenti</li>
                <li>Valutazione di rischi e opportunità</li>
                <li>Considerazione degli impatti a lungo termine</li>
              </ul>
            </li>
            <li>Bilanciamento dei fattori:
              <ul>
                <li>Valutazione di costi e benefici</li>
                <li>Considerazione degli stakeholder</li>
                <li>Allineamento con gli obiettivi strategici</li>
              </ul>
            </li>
          </ol>
  
          <h3>Motivazione del Team</h3>
          <p>Strategie efficaci per incentivare e premiare:</p>
          <ul>
            <li>Riconoscimento regolare dei successi</li>
            <li>Sistemi di reward personalizzati</li>
            <li>Feedback costruttivo e costante</li>
            <li>Creazione di opportunità di crescita</li>
          </ul>
  
          <h3>Ambiente Collaborativo</h3>
          <p>Creare una cultura di team positiva:</p>
          <ul>
            <li>Promuovere la comunicazione aperta</li>
            <li>Incoraggiare l'innovazione</li>
            <li>Celebrare i successi di squadra</li>
            <li>Gestire i conflitti in modo costruttivo</li>
          </ul>
        `,
        quiz: [
          {
            id: "q3m3l2",
            question: "Quale caratteristica è più importante per un leader Harmonya?",
            options: [
              "Controllare ogni decisione del team",
              "Guidare con l'esempio e ispirare fiducia",
              "Evitare di delegare responsabilità",
              "Concentrarsi solo sui risultati immediati"
            ],
            correctAnswer: "Guidare con l'esempio e ispirare fiducia"
          }
        ]
      },
      {
        id: "m3l3",
        title: "Mindfulness e Gestione dello Stress",
        content: `
          <h2>Tecniche per il Benessere Mentale e la Produttività</h2>
  
          <h3>Pratiche di Mindfulness</h3>
          <ul>
            <li>Tecniche di meditazione quotidiana
              <ul>
                <li>Esercizi di respirazione consapevole</li>
                <li>Meditazione guidata</li>
                <li>Pratica della presenza mentale</li>
              </ul>
            </li>
            <li>Gestione dell'attenzione
              <ul>
                <li>Focus su una task alla volta</li>
                <li>Eliminazione delle distrazioni</li>
                <li>Pause strategiche</li>
              </ul>
            </li>
          </ul>
  
          <h3>Gestione del Tempo</h3>
          <ol>
            <li>Pianificazione efficace:
              <ul>
                <li>Prioritizzazione dei compiti</li>
                <li>Time blocking</li>
                <li>Gestione del calendario</li>
              </ul>
            </li>
            <li>Tecniche di produttività:
              <ul>
                <li>Metodo Pomodoro</li>
                <li>Lista di to-do prioritizzata</li>
                <li>Routine quotidiane strutturate</li>
              </ul>
            </li>
          </ol>
  
          <h3>Work-Life Balance</h3>
          <p>Strategie per mantenere l'equilibrio:</p>
          <ul>
            <li>Stabilire confini chiari tra lavoro e vita privata</li>
            <li>Praticare attività di self-care</li>
            <li>Dedicare tempo al riposo e al recupero</li>
            <li>Coltivare interessi al di fuori del lavoro</li>
          </ul>
        `,
        quiz: [
          {
            id: "q3m3l3",
            question: "Quale pratica è più efficace per la gestione dello stress a lungo termine?",
            options: [
              "Ignorare i segnali di stress",
              "Lavorare senza pause",
              "Stabilire una routine di mindfulness",
              "Aumentare il carico di lavoro"
            ],
            correctAnswer: "Stabilire una routine di mindfulness"
          }
        ]
      },
      {
        id: "m4l1",
        title: "Strumenti e Tecniche di Promozione",
        content: `
          <h2>Strategie di Promozione Efficace</h2>
  
          <h3>Marketing Digitale</h3>
          <ul>
            <li>Presenza sui social media
              <ul>
                <li>Creazione di contenuti di valore</li>
                <li>Engagement con il pubblico target</li>
                <li>Utilizzo strategico degli hashtag</li>
              </ul>
            </li>
            <li>Content marketing
              <ul>
                <li>Blog posts informativi</li>
                <li>Video educativi</li>
                <li>Case studies di successo</li>
              </ul>
            </li>
          </ul>
  
          <h3>Presentazione dei Benefici</h3>
          <ol>
            <li>Comunicazione del valore:
              <ul>
                <li>Focus sui benefici concreti</li>
                <li>Utilizzo di esempi reali</li>
                <li>Testimonianze di successo</li>
              </ul>
            </li>
            <li>Gestione delle obiezioni:
              <ul>
                <li>Risposte a domande comuni</li>
                <li>Chiarimento dei dubbi</li>
                <li>Trasparenza nelle informazioni</li>
              </ul>
            </li>
          </ol>
  
          <h3>Strategie di Marketing Personale</h3>
          <p>Sviluppo del personal brand:</p>
          <ul>
            <li>Definizione della propria unicità</li>
            <li>Coerenza nella comunicazione</li>
            <li>Networking strategico</li>
            <li>Presenza professionale online</li>
          </ul>
        `,
        quiz: [
          {
            id: "q4m4l1",
            question: "Quale elemento è più importante nella promozione di Harmonya?",
            options: [
              "Vendita aggressiva",
              "Comunicazione trasparente dei benefici",
              "Nascondere le informazioni",
              "Ignorare le domande degli interessati"
            ],
            correctAnswer: "Comunicazione trasparente dei benefici"
          }
        ]
      },
      {
        id: "m4l2",
        title: "Massimizzare i Profitti come Manager",
        content: `
          <h2>Ottimizzazione delle Performance</h2>
  
          <h3>Monitoraggio dei Risultati</h3>
          <ul>
            <li>KPI principali:
              <ul>
                <li>Numero di nuovi membri VIP</li>
                <li>Tasso di retention</li>
                <li>Volume delle transazioni</li>
                <li>Engagement della community</li>
              </ul>
            </li>
            <li>Analisi dei dati:
              <ul>
                <li>Trend di crescita</li>
                <li>Aree di miglioramento</li>
                <li>Performance comparative</li>
              </ul>
            </li>
          </ul>
  
          <h3>Strategie di Crescita</h3>
          <ol>
            <li>Espansione del network:
              <ul>
                <li>Identificazione di nuovi mercati</li>
                <li>Partnership strategiche</li>
                <li>Programmi di referral</li>
              </ul>
            </li>
            <li>Ottimizzazione delle conversioni:
              <ul>
                <li>Miglioramento del processo di onboarding</li>
                <li>Follow-up sistematico</li>
                <li>Supporto personalizzato</li>
              </ul>
            </li>
          </ol>
        `,
        quiz: [
          {
            id: "q4m4l2",
            question: "Quale metrica è più importante per valutare il successo di un Manager?",
            options: [
              "Numero di email inviate",
              "Ore lavorate al giorno",
              "Numero di nuovi membri VIP attivi",
              "Numero di post sui social"
            ],
            correctAnswer: "Numero di nuovi membri VIP attivi"
          }
        ]
      },
      {
        id: "final-exam",
        title: "Esame Finale di Certificazione Manager",
        content: `
          <h2>Esame di Certificazione Manager Harmonya</h2>
          <p>Questo esame valuterà la tua comprensione completa del ruolo di Manager e la tua preparazione per guidare una community di successo.</p>
  
          <h3>Struttura dell'Esame</h3>
          <ol>
            <li>Test Teorico Completo (40% del punteggio)</li>
            <li>Caso Studio Pratico (30% del punteggio)</li>
            <li>Simulazione di Leadership (30% del punteggio)</li>
          </ol>
        `,
        quiz: [
          {
            id: "final-1",
            question: "Qual è il ruolo principale di un Manager Harmonya?",
            options: [
              "Gestire gli investimenti diretti",
              "Guidare e sviluppare la community",
              "Fare trading attivo",
              "Gestire l'ufficio"
            ],
            correctAnswer: "Guidare e sviluppare la community"
          },
          {
            id: "final-2",
            question: "Come si costruisce al meglio la fiducia nella community?",
            options: [
              "Promettendo guadagni facili",
              "Essendo trasparenti e fornendo supporto concreto",
              "Evitando il confronto",
              "Nascondendo le difficoltà"
            ],
            correctAnswer: "Essendo trasparenti e fornendo supporto concreto"
          },
          {
            id: "final-3",
            question: "Quale approccio è migliore per gestire lo stress?",
            options: [
              "Ignorarlo completamente",
              "Praticare mindfulness e gestione del tempo",
              "Lavorare più ore",
              "Delegare tutto"
            ],
            correctAnswer: "Praticare mindfulness e gestione del tempo"
          },
          {
            id: "final-4",
            question: "Come si misura meglio il successo di un Manager?",
            options: [
              "Numero di ore lavorate",
              "Crescita e engagement della community",
              "Numero di email inviate",
              "Quantità di riunioni fatte"
            ],
            correctAnswer: "Crescita e engagement della community"
          },
          {
            id: "final-5",
            question: "Qual è la migliore strategia di networking?",
            options: [
              "Concentrarsi solo sui potenziali clienti",
              "Costruire relazioni autentiche e di valore",
              "Raccogliere più contatti possibili",
              "Evitare i social media"
            ],
            correctAnswer: "Costruire relazioni autentiche e di valore"
          },
          {
            id: "final-6",
            question: "Come gestire al meglio il proprio team?",
            options: [
              "Controllare ogni decisione",
              "Empowerment e supporto alla crescita",
              "Evitare il feedback",
              "Concentrarsi solo sui numeri"
            ],
            correctAnswer: "Empowerment e supporto alla crescita"
          },
          {
            id: "final-7",
            question: "Qual è il modo migliore per promuovere Harmonya?",
            options: [
              "Vendita aggressiva",
              "Condivisione trasparente di valore e opportunità",
              "Nascondere i rischi",
              "Promettere risultati garantiti"
            ],
            correctAnswer: "Condivisione trasparente di valore e opportunità"
          },
          {
            id: "final-8",
            question: "Come mantenere un work-life balance efficace?",
            options: [
              "Lavorare costantemente",
              "Stabilire confini chiari e routine equilibrate",
              "Ignorare la vita personale",
              "Delegare tutto il lavoro"
            ],
            correctAnswer: "Stabilire confini chiari e routine equilibrate"
          },
          {
            id: "final-9",
            question: "Quale aspetto della leadership è più importante?",
            options: [
              "Dare ordini",
              "Guidare con l'esempio",
              "Evitare i conflitti",
              "Mantenere il controllo"
            ],
            correctAnswer: "Guidare con l'esempio"
          },
          {
            id: "final-10",
            question: "Come gestire al meglio le obiezioni?",
            options: [
              "Ignorarle",
              "Affrontarle con trasparenza e soluzioni concrete",
              "Cambiare argomento",
              "Minimizzare i problemi"
            ],
            correctAnswer: "Affrontarle con trasparenza e soluzioni concrete"
          }
        ]
      }
    ]
  };
  
  async function insertCourse() {
    try {
      // Verifica se esiste già un corso con lo stesso titolo
      const coursesRef = collection(db, 'courses');
      const querySnapshot = await getDocs(query(coursesRef, where('title', '==', managerCourse.title)));
      
      if (!querySnapshot.empty) {
        console.log("ATTENZIONE: Un corso con questo titolo esiste già. Aggiornamento in corso...");
        
        const existingCourseId = querySnapshot.docs[0].id;
        await updateDoc(doc(coursesRef, existingCourseId), {
          ...managerCourse,
          updatedAt: serverTimestamp()
        });
        
        console.log("Corso aggiornato con successo! ID:", existingCourseId);
        return existingCourseId;
      }
  
      // Inserisci nuovo corso
      const docRef = await addDoc(collection(db, 'courses'), {
        ...managerCourse,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log("Nuovo corso inserito con successo! ID:", docRef.id);
      console.log("Totale lezioni caricate:", managerCourse.lessons.length);
      
      return docRef.id;
    } catch (error) {
      console.error("Errore durante l'inserimento del corso:", error);
      console.log("Dettagli errore:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Esegui l'inserimento
  insertCourse()
    .then(courseId => {
      console.log("Script completato con successo!");
      console.log("ID del corso:", courseId);
      process.exit(0);
    })
    .catch(error => {
      console.error("Errore durante l'esecuzione dello script:", error);
      process.exit(1);
    });