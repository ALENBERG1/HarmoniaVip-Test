import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function ManageDocuments() {
  const [documents, setDocuments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.telegramId}/documents`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null // Gestione data
      }));
      setDocuments(documentsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${user.telegramId}/documents`, id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Gestisci Documenti</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((document) => (
            <li key={document.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {document.fileName || 'Senza nome'}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      {document.createdAt ? document.createdAt.toLocaleString() : 'Data non disponibile'}
                    </p>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
