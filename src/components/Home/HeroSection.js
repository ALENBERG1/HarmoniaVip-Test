import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div 
    className="relative w-full h-screen flex items-center justify-center overflow-hidden" 
    style={{ 
        backgroundImage: "url('/bg-5.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 z-0" />
      
      <motion.div 
        className="relative z-10 text-center px-4" 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <motion.div 
          initial={{ scale: 0.8 }}w 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.5 }} 
          className="mb-8"
        >
          <Image src="/NETWORKINGPLATFORM.png" alt="Harmonya Logo" width={300} height={150} className="mx-auto" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-[#CFB53B]">
          La piattaforma per Manager
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Diventa Manager e sfrutta al massimo i benefici esclusivi di HARMONYA
        </p>
        
        <motion.a 
          href="#" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          className="inline-block bg-[#0C1A0E] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Scopri il Piano Compensi
        </motion.a>
      </motion.div>      
    </div>
  );
}