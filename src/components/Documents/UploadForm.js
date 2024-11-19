import { useState } from 'react';
import { storage, db } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const categories = ['Presentazione', 'Documenti', 'Informazioni', 'Immagini', 'Tutorial'];

export default function UploadForm({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log("File selezionato:", e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !category) {
      console.log("Nessun file selezionato o categoria non specificata");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `documents/${category}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Ottenere il nome o username dell'utente
      const uploadedBy = user.username || user.firstName || 'Unknown User';

      // Salvare i dettagli del documento nel database Firestore
      await addDoc(collection(db, `users/${user.telegramId}/documents`), {
        fileName: file.name || 'Nome non disponibile',
        fileType: file.type || 'N/D',
        fileSize: file.size,
        category: category || 'Non specificato',
        url: downloadURL,
        uploadedBy: uploadedBy,  // Associare il nome o username dell'utente
        createdAt: serverTimestamp()
      });

      alert('Documento caricato con successo!');
      setFile(null);
      setCategory('');
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Errore durante il caricamento del documento:', error);
      alert('Si è verificato un errore durante il caricamento del documento.');
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">File</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Categoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300"
          required
        >
          <option value="">Seleziona una categoria</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={!file || !category || uploading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          !file || !category || uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {uploading ? 'Caricamento in corso...' : 'Carica Documento'}
      </button>
    </form>
  );
}
