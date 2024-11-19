import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import NoteForm from '../components/Notes/NoteForm';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (note) => {
    if (!user || !user.telegramId) {
      console.error('User data not found');
      setSuccessMessage('Errore durante il salvataggio della nota. Dati utente non validi.');
      return;
    }

    setOperationLoading(true);
    try {
      const createdBy = user.username || user.firstName || `User${user.telegramId}`;
      const noteData = {
        content: note.content,
        createdBy: createdBy,
        creatorId: user.telegramId,
        creatorUsername: user.username || '',
        createdAt: serverTimestamp()
      };

      if (editingNote) {
        const userNoteRef = doc(db, `users/${user.telegramId}/notes`, editingNote.id);
        const generalNoteRef = doc(db, 'notes', editingNote.id);

        await updateDoc(userNoteRef, {
          ...noteData,
          updatedAt: serverTimestamp(),
          updatedBy: createdBy
        });

        await updateDoc(generalNoteRef, {
          ...noteData,
          updatedAt: serverTimestamp(),
          updatedBy: createdBy
        });

        setEditingNote(null);
        setSuccessMessage("Nota aggiornata con successo!");
      } else {
        const userNoteRef = await addDoc(collection(db, `users/${user.telegramId}/notes`), noteData);

        await setDoc(doc(db, 'notes', userNoteRef.id), {
          ...noteData,
          userId: user.telegramId
        });

        setSuccessMessage("Nota creata con successo!");
      }
    } catch (error) {
      console.error('Errore durante il salvataggio della nota: ', error);
      setSuccessMessage('Errore durante il salvataggio della nota. Per favore, riprova.');
    } finally {
      setOperationLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000); // Rimuove il messaggio di successo dopo 3 secondi
    }
  };

  const handleEdit = (note) => {
    if (note.creatorId === user.telegramId) {
      setEditingNote(note);
    } else {
      setSuccessMessage("Non puoi modificare le note create da altri utenti.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDelete = async (id, creatorId) => {
    if (!user || !user.telegramId) {
      console.error('User data not found');
      setSuccessMessage('Errore durante l\'eliminazione della nota. Dati utente non validi.');
      return;
    }

    if (creatorId !== user.telegramId) {
      setSuccessMessage('Non puoi eliminare le note create da altri utenti.');
      return;
    }

    setOperationLoading(true);
    try {
      await deleteDoc(doc(db, `users/${creatorId}/notes`, id));
      await deleteDoc(doc(db, 'notes', id));

      setSuccessMessage("Nota eliminata con successo!");
    } catch (error) {
      console.error('Errore durante l\'eliminazione della nota: ', error);
      setSuccessMessage('Errore durante l\'eliminazione della nota. Per favore, riprova.');
    } finally {
      setOperationLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000); // Rimuove il messaggio di successo dopo 3 secondi
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user || !user.telegramId) {
    return <Layout><div>Errore: Dati utente non disponibili. Per favore, effettua nuovamente il login.</div></Layout>;
  }

  return (
    <Layout>
      {operationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}
      
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}

      <h1 className="text-3xl font-semibold mb-6 text-white">Note</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">{editingNote ? 'Modifica Nota' : 'Aggiungi Nota'}</h2>
          <NoteForm onSubmit={handleSubmit} initialNote={editingNote} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Le tue Note</h2>
          {notes.length === 0 ? (
            <p className="text-gray-400">Non hai ancora creato nessuna nota.</p>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note.id} className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="mt-1 max-w-2xl text-sm text-gray-400">{note.content}</p>
                    <p className="mt-1 text-sm text-gray-500">Creata da: {note.createdBy} (@{note.creatorUsername})</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Creata il: {note.createdAt?.toDate().toLocaleString()}
                    </p>
                    {note.updatedAt && (
                      <p className="mt-1 text-sm text-gray-500">
                        Aggiornata il: {note.updatedAt.toDate().toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-gray-900 text-right sm:px-6">
                    {note.creatorId === user.telegramId && (
                      <>
                        <button
                          onClick={() => handleEdit(note)}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(note.id, note.creatorId)}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Elimina
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}