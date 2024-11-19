import nodemailer from 'nodemailer';

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

  try {
    const { to, name } = req.body;
    const siteUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://webinar.harmonya.io'
        : 'http://localhost:3000';

    // Log per verificare i dati ricevuti
    console.log('Dati ricevuti:', { to, name });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verifica la configurazione del trasportatore
    transporter.verify((error, success) => {
      if (error) {
        console.error('Errore nella verifica del trasportatore:', error);
      } else {
        console.log('Trasportatore pronto:', success);
      }
    });

    const mailOptions = {
      from: {
        name: 'Harmonya Official',
        address: process.env.GMAIL_USER,
      },
      to,
      subject: 'Benvenuto in Harmonya! Completa la tua Registrazione',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A3B2E;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img
              src="${siteUrl}/Logo-harmonya-email.png"
              alt="Harmonya Logo"
              style="max-width: 200px; width: 100%; height: auto;"
            />
          </div>
          
          <div style="background-color: #0C1A0E; padding: 30px; border-radius: 10px; border: 2px solid #D19E23; box-shadow: 0 0 12px #FFB400;">
            <h2 style="color: #D19E23; margin-bottom: 20px; text-align: center; font-size: 24px;">
              Benvenuto in Harmonya, ${name}!
            </h2>
            
            <p style="color: white; line-height: 1.8; margin-bottom: 20px;">
              Siamo entusiasti di confermare la tua pre-registrazione al nostro evento esclusivo che si terrà <strong style="color: #D19E23;">Domenica 3 novembre alle ore 11:00</strong> tramite webinar.
            </p>
            
            <p style="color: white; line-height: 1.8; margin-bottom: 20px;">
              Per completare la registrazione e assicurarti un posto all'evento, clicca sul pulsante qui sotto:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://us06web.zoom.us/webinar/register/3417302015352/WN_ytwbqanISoCnIRDMGwFc_g" target="_blank" style="background-color: #D19E23; color: #0C1A0E; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Completa la Registrazione
              </a>
            </div>
            
            <p style="color: white; line-height: 1.8; margin-bottom: 20px;">
              Durante l'incontro avrai l'opportunità di scoprire in anteprima cosa HARMONYA sta costruendo e di interagire con professionisti del settore.
            </p>
    
            <div style="margin: 40px 0; padding: 20px; background-color: rgba(209, 158, 35, 0.1); border-radius: 8px;">
              <p style="color: #D19E23; font-size: 14px; margin-bottom: 15px; text-align: center;">
                <strong>Nota:</strong> Questa è un'email generata automaticamente; non è possibile rispondere direttamente a questo messaggio.
              </p>
              <p style="color: white; font-size: 14px; text-align: center;">
                Per qualsiasi domanda o necessità di assistenza, ti invitiamo a contattarci attraverso i nostri canali social.
              </p>
            </div>
    
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #D19E23; margin-bottom: 15px;">Segui Harmonya su:</p>
              <div style="display: inline-block; margin: 0 auto;">
                <table role="presentation" style="display: inline-block;">
                  <tr>
                    <td style="padding: 0 15px;">
                      <a href="https://instagram.com/theharmonyaclub" target="_blank" style="text-decoration: none;">
                        <!-- Icona Instagram -->
                        <svg width="24" height="24" fill="#D19E23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
<path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9
                            s51.3 114.9 114.9 114.9
                            S339 319.5 339 255.9
                            287.7 141 224.1 141zm0 189.6
                            c-41.1 0-74.7-33.5-74.7-74.7
                            s33.5-74.7 74.7-74.7
                            74.7 33.5 74.7 74.7
                            -33.6 74.7-74.7 74.7zm146.4-194.3
                            c0 14.9-12 26.8-26.8 26.8
                            -14.9 0-26.8-12-26.8-26.8
                            s12-26.8 26.8-26.8
                            26.8 12 26.8 26.8zm76.1 27.2
                            c-1.7-35.9-9.9-67.7-36.2-93.9
                            -26.2-26.2-58-34.4-93.9-36.2
                            -37-2.1-147.9-2.1-184.9 0
                            -35.8 1.7-67.6 9.9-93.9 36.1
                            s-34.4 58-36.2 93.9
                            c-2.1 37-2.1 147.9 0 184.9
                            1.7 35.9 9.9 67.7 36.2 93.9
                            s58 34.4 93.9 36.2
                            c37 2.1 147.9 2.1 184.9 0
                            35.9-1.7 67.7-9.9 93.9-36.2
                            26.2-26.2 34.4-58 36.2-93.9
                            2.1-37 2.1-147.8 0-184.8zM398.8 388
                            c-7.8 19.6-22.9 34.7-42.6 42.6
                            -29.5 11.7-99.5 9-132.1 9
                            s-102.7 2.6-132.1-9
                            c-19.6-7.8-34.7-22.9-42.6-42.6
                            -11.7-29.5-9-99.5-9-132.1
                            s-2.6-102.7 9-132.1
                            c7.8-19.6 22.9-34.7 42.6-42.6
                            29.5-11.7 99.5-9 132.1-9
                            s102.7-2.6 132.1 9
                            c19.6 7.8 34.7 22.9 42.6 42.6
                            11.7 29.5 9 99.5 9 132.1
                            s2.7 102.7-9 132.1z"/>
                          </svg>
                        <div style="color: white; font-size: 12px; margin-top: 5px;">Instagram</div>
                      </a>
                    </td>
                    <td style="padding: 0 15px;">
                      <a href="https://tiktok.com/@theharmonyaclub" target="_blank" style="text-decoration: none;">
                        <!-- Icona TikTok -->
                        <svg width="24" height="24" fill="#D19E23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                          <path d="M448,209.91 a210.06,210.06,0,0,1-122.77-39.25V349.38 A162.55,162.55,0,1,1,185,188.31V278.2 a74.62,74.62,0,1,0,52.23,71.18V0h88 a121.18,121.18,0,0,0,1.86,22.17 h0A122.18,122.18,0,0,0,381,102.39 a121.43,121.43,0,0,0,67,20.14Z"/>
                        </svg>
                        <div style="color: white; font-size: 12px; margin-top: 5px;">TikTok</div>
                      </a>
                    </td>
                    <td style="padding: 0 15px;">
                      <a href="https://x.com/theharmonyaclub" target="_blank" style="text-decoration: none;">
                        <!-- Icona Twitter -->
                        <svg width="24" height="24" fill="#D19E23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M459.4 151.7 c.32 4.54.32 9.1.32 13.69 0 139.4-106.18 300-300 300 A297.2 297.2 0 0 1 0 397.8 a218.8 218.8 0 0 0 25.9 1.5 a211.3 211.3 0 0 0 130.9-45.1 a105.6 105.6 0 0 1-98.7-73.4 a132.7 132.7 0 0 0 19.8 1.5 a111.8 111.8 0 0 0 27.6-3.6 a105.4 105.4 0 0 1-84.5-103.4 v-1.5a105.9 105.9 0 0 0 47.5 13.3 a105.6 105.6 0 0 1-32.7-140.9 a300.3 300.3 0 0 0 217.9 110.5 a118.9 118.9 0 0 1-2.6-24.1 a105.4 105.4 0 0 1 182-72.1 a208.1 208.1 0 0 0 66.9-25.6 a105.5 105.5 0 0 1-46.2 58.1 a211.6 211.6 0 0 0 60.6-16.2 a226.6 226.6 0 0 1-52.6 54.6z"/>
                        </svg>
                        <div style="color: white; font-size: 12px; margin-top: 5px;">Twitter</div>
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      `,
    };

    // Log delle opzioni dell'email
    console.log('Opzioni email:', mailOptions);

    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo a:', to);
    res.status(200).json({ message: 'Email inviata con successo' });
  } catch (error) {
    console.error("Errore nell'invio dell'email:", error);
    res.status(500).json({
      message: "Errore nell'invio dell'email",
      error: error.message,
    });
  }
}