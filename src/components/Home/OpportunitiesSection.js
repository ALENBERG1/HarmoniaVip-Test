import { motion } from 'framer-motion';
import { Star, Award, TrendingUp, Gift, Zap, Lock } from 'lucide-react';
import Image from 'next/image';

export default function OpportunitiesSection() {
  return (
    <motion.div
      id="opportunities"
      className="py-4 px-4 space-y-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto relative">
        
        {/* Sezione Condividi il Successo */}
        <div className="flex flex-col lg:flex-row items-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
          <div className="lg:w-1/2 flex justify-center p-4">
            <div className="w-full h-full max-w-[1200px] lg:max-w-[1600px]">
              <Image
                src="/bg-1.png"
                alt="Condividi il Successo"
                layout="responsive"
                width={1200}  
                height={1200} 
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2 p-4 lg:pl-16 space-y-4 text-center lg:text-left">
            <OpportunityCard
              title="Vuoi condividere il successo?"
              description="Diventa promotore della membership Harmonya e costruisci una rete solida di guadagni con i tuoi amici e colleghi. Ogni nuova connessione rappresenta un'opportunità di crescita attraverso la vendita della membership."
              items={[
                { icon: <Star className="text-[var(--accent-primary)] w-5 h-5" />, text: "Costo della membership: 349$" },
                { icon: <Award className="text-[var(--accent-secondary)] w-5 h-5" />, text: "Guadagna il 15% su ogni membership venduta tramite il tuo referral" },
              ]}
              reward="Bonus di benvenuto: 52.35 USDT accreditati per ogni nuovo membro che acquista la membership."
            />
          </div>
        </div>

        {/* Sezione Salto di Qualità */}
        <div className="flex flex-col lg:flex-row-reverse items-center min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-8 lg:pt-0">
          <div className="lg:w-1/2 flex justify-center p-4">
            <div className="w-full h-full max-w-[1200px] lg:max-w-[1600px]">
              <Image
                src="/bg-2.png"
                alt="Salto di Qualità"
                layout="responsive"
                width={1200}  
                height={1200} 
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/2 p-4 lg:pr-16 space-y-4 text-center lg:text-left">
            <OpportunityCard
              title="Pronto a fare il salto di qualità?"
              description="Diventa un Manager Harmonya e accedi a un sistema di guadagni che premia la tua leadership e capacità di crescita. Ottieni di più vendendo la membership e aiutando il tuo team a fare lo stesso."
              items={[
                { icon: <Gift className="text-[var(--accent-secondary)] w-5 h-5" />, text: "Ottieni guadagni su ogni membership venduta dal tuo team" },
                { icon: <Star className="text-[var(--accent-primary)] w-5 h-5" />, text: "Accesso prioritario agli eventi Harmonya riservati ai Manager" },
                { icon: <Zap className="text-[var(--accent-secondary)] w-5 h-5" />, text: "Libertà di far crescere il tuo team con supporto dedicato" },
                { icon: <TrendingUp className="text-[var(--accent-secondary)] w-5 h-5" />, text: "Incremento delle entrate con la crescita del tuo team" },
                { icon: <Lock className="text-[var(--accent-primary)] w-5 h-5" />, text: "Accesso completo e riservato alla piattaforma Manager" },
              ]}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OpportunityCard({ title, description, items, reward }) {
  return (
    <motion.div className="space-y-4" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <h2 className="text-3xl font-bold flex items-center gap-2 text-[var(--accent-dark)]">
        {title}
      </h2>
      <p className="mb-2">{description}</p>
      <ul className="list-none space-y-2">
        {items.map((item, index) => (
          <motion.li
            key={index}
            className="flex items-center gap-2 text-[var(--foreground)]"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.icon}
            {item.text}
          </motion.li>
        ))}
      </ul>
      {reward && <p className="text-[var(--accent-secondary)] font-bold mt-4">{reward}</p>}
    </motion.div>
  );
}