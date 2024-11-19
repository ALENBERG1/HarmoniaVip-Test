// src/pages/webinars.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Loader from '../components/Loader';

export default function Webinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    setLoading(true);
    try {
      const webinarsRef = collection(db, 'webinars'); // Assicurati che questa collezione sia impostata su Firebase
      const snapshot = await getDocs(webinarsRef);
      const webinarData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWebinars(webinarData);
    } catch (error) {
      console.error("Error fetching webinars:", error);
      alert('Errore nel caricamento dei webinar. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    try {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error('Invalid YouTube URL:', url);
      return '';
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="bg-[#0c0c0c] min-h-screen p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Webinar e Presentazioni</h1>
        
        {webinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map(webinar => (
              <div key={webinar.id} className="bg-[#0C1A0E] rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-2">{webinar.title}</h2>
                <p className="text-gray-300 text-sm mb-4">{webinar.description}</p>
                
                {/* Integrazione dell'iframe YouTube */}
                <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                  <iframe
                    src={getYouTubeEmbedUrl(webinar.videoUrl)}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    title={webinar.title}
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">Nessun webinar disponibile al momento.</p>
        )}
      </div>
    </Layout>
  );
}