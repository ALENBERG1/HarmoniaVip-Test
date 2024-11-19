import React, { useEffect, useRef } from 'react';

const Loader = () => {
  const container = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lottie = require('lottie-web'); // Importa dinamicamente sul client
      lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/harmonya_loader.json', // Percorso corretto del file JSON
      });
    }
  }, []);

  return <div ref={container} style={{ width: 200, height: 200 }}></div>;
};

export default Loader;
//