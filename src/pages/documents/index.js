// pages/documents/index.js
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DocumentTable from '../../components/Documents/DocumentTable';
import UploadForm from '../../components/Documents/UploadForm';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, collectionGroup } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import Loader from '@/components/Loader';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Funzione aggiornata per caricare i documenti di tutti gli utenti
  const loadDocuments = () => {
    if (!user) return;

    // Usa collectionGroup per ottenere tutti i documenti dalla sottocollezione "documents"
    const q = query(
      collectionGroup(db, 'documents'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        // Aggiungi path del documento per riferimento
        path: doc.ref.path
      }));
      setDocuments(docs);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = loadDocuments();
    return () => unsubscribe && unsubscribe();
  }, [user]);

  // Funzione chiamata dopo il completamento dell'upload
  const handleUploadComplete = () => {
    loadDocuments();
  };

  if (loading) {
    return <Loader />;  // Sostituisce "Caricamento..." con il loader trasparente
  }

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6 text-white">Documenti</h1>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Carica Documento</h2>
          <UploadForm onUploadComplete={handleUploadComplete} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Tabella Documenti</h2>
          <DocumentTable documents={documents} />
        </div>
      </div>
    </Layout>
  );
}