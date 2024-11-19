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

    console.log('Dati ricevuti:', { to, name });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

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
      subject: 'Ti ricordiamo il webinar Harmonya del 3 novembre!',
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
              Caro ${name}, ti ricordiamo l'evento Harmonya del 3 novembre!
            </h2>
            
            <p style="color: white; line-height: 1.8; margin-bottom: 20px;">
              Il nostro evento esclusivo si terrà <strong style="color: #D19E23;">Domenica 3 novembre alle ore 11:00</strong> tramite webinar.
            </p>
            
            <p style="color: white; line-height: 1.8; margin-bottom: 20px;">
              Assicurati di completare la registrazione per garantire il tuo posto:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://us06web.zoom.us/webinar/register/3417302015352/WN_ytwbqanISoCnIRDMGwFc_g" target="_blank" style="background-color: #D19E23; color: #0C1A0E; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Completa la Registrazione
              </a>
            </div>
            
            <p style="color: white; line-height: 1.8; margin-bottom: 20px;">
              Durante l'incontro, scoprirai in anteprima i progetti Harmonya e avrai l'opportunità di interagire con professionisti del settore.
            </p>

            <div style="margin: 40px 0; padding: 20px; background-color: rgba(209, 158, 35, 0.1); border-radius: 8px;">
              <p style="color: #D19E23; font-size: 14px; margin-bottom: 15px; text-align: center;">
                <strong>Nota:</strong> Questa è un'email generata automaticamente; non è possibile rispondere direttamente a questo messaggio.
              </p>
              <p style="color: white; font-size: 14px; text-align: center;">
                Per assistenza, contattaci tramite i nostri canali social.
              </p>
            </div>
    
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #D19E23; margin-bottom: 15px;">Seguici su:</p>
              <div style="display: inline-block; margin: 0 auto;">
                <table role="presentation" style="display: inline-block;">
                  <tr>
                    <td style="padding: 0 15px;">
                      <a href="https://instagram.com/theharmonyaclub" target="_blank" style="text-decoration: none;">
                        <svg width="24" height="24" fill="#D19E23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                          <path d="..."/>
                        </svg>
                        <div style="color: white; font-size: 12px; margin-top: 5px;">Instagram</div>
                      </a>
                    </td>
                    <td style="padding: 0 15px;">
                      <a href="https://tiktok.com/@theharmonyaclub" target="_blank" style="text-decoration: none;">
                        <svg width="24" height="24" fill="#D19E23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                          <path d="..."/>
                        </svg>
                        <div style="color: white; font-size: 12px; margin-top: 5px;">TikTok</div>
                      </a>
                    </td>
                    <td style="padding: 0 15px;">
                      <a href="https://x.com/theharmonyaclub" target="_blank" style="text-decoration: none;">
                        <svg width="24" height="24" fill="#D19E23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="..."/>
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
