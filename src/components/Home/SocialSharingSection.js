import { motion } from 'framer-motion';
import { FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';

export default function SocialSharingSection() {
  const platforms = [
    { name: "Instagram", icon: <FaInstagram className="text-[var(--accent-primary)]" />, href: "https://instagram.com/theharmonyaclub" },
    { name: "TikTok", icon: <FaTiktok className="text-[var(--accent-primary)]" />, href: "https://tiktok.com/@theharmonyaclub" },
    { name: "X", icon: <FaTwitter className="text-[var(--accent-primary)]" />, href: "https://x.com/theharmonyaclub" },
  ];

  return (
    <motion.div
      className="py-12 px-4 bg-[var(--background)] text-[var(--foreground)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xl text-[var(--neutral-grey)] mb-6">Seguici sui social</p>
        <div className="flex flex-col md:flex-row justify-center md:space-x-6 space-y-4 md:space-y-0">
          {platforms.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }} // Effetto di rialzo mantenendo il colore del testo
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-center space-x-2 px-6 py-2 bg-[#0C1A0E] text-[var(--foreground)] rounded-full text-sm font-semibold transition-all duration-300 hover:text-[var(--foreground)] w-full md:w-auto"
            >
              {platform.icon}
              <span>Seguici su {platform.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
