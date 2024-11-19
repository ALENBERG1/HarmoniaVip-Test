import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export default function Loader() {
  const containerRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/harmonya_loader.json'  // Assicurati che il percorso sia corretto
    });

    // Rimuove eventuale sfondo dell'animazione Lottie
    anim.addEventListener('DOMLoaded', () => {
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.backgroundColor = 'transparent';
      }
    });

    return () => anim.destroy();
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 pointer-events-none"
    >
      <div
        ref={containerRef}
        style={{ width: '100px', height: '100px', backgroundColor: 'transparent' }}
      ></div>
    </div>
  );
}