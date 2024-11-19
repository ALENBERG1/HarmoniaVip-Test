export default function Footer() {
    return (
      <footer className="bg-[var(--background)] py-12 border-t border-gray-800 text-[var(--foreground)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <FooterColumn 
              title="Quick Links" 
              links={[
                { text: "Home", href: "/" },
                { text: "Harmonya App", href: "https://t.me/Harmonyaclub_bot" },
                { text: "Harmonya Manager Platform", href: "https://t.me/harmonyavip_bot" }
              ]}
            />
            <FooterColumn 
              title="Support" 
              links={[{ text: "Email: supporto@harmonya.io", href: "#" }]} 
            />
            <FooterColumn 
              title="Legal" 
              links={[{ text: "Termini e condizioni", href: "#" }, { text: "Privacy Policy", href: "#" }]} 
            />
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Harmonya. Tutti i diritti riservati.</p>
            <p className="text-xs text-gray-500 mt-2 italic">
              © 2024 Harmonya. L'investimento in criptovalute, metalli preziosi e prodotti finanziari comporta rischi significativi, inclusa la possibile perdita del capitale investito. I rendimenti passati non sono indicativi di risultati futuri. Le informazioni fornite non costituiscono consulenza finanziaria, fiscale o legale. Prima di prendere qualsiasi decisione di investimento, si consiglia di consultare un professionista qualificato. Harmonya non garantisce l'accuratezza, la completezza o la tempestività delle informazioni fornite. È responsabilità dell'investitore valutare attentamente i rischi associati a ciascun investimento e verificare la conformità con le proprie circostanze finanziarie e obiettivi di investimento. Gli asset e i servizi presentati possono non essere disponibili in tutte le giurisdizioni e potrebbero essere soggetti a restrizioni normative locali. La partecipazione al club Harmonya non implica alcuna garanzia di profitto o rendimento. Ogni membro è responsabile delle proprie decisioni di investimento e dell'osservanza delle leggi e dei regolamenti applicabili nella propria giurisdizione. Harmonya non detiene, gestisce o controlla direttamente fondi dei membri. Tutte le transazioni e gli investimenti sono effettuati attraverso partner e fornitori di servizi regolamentati nelle rispettive giurisdizioni.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
  function FooterColumn({ title, links }) {
    return (
      <div>
        <h4 className="text-lg font-bold mb-4">{title}</h4>
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  