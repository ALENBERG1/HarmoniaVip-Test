import Layout from '../../components/Layout';
import UploadForm from '../../components/Documents/UploadForm';
import { storage, db } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function UploadDocument() {
  const router = useRouter();
  const { user } = useAuth();

  const handleUpload = async (file, metadata) => {
    try {
      if (!user) return;  // Assicuriamoci che l'utente sia autenticato

      // Upload del file su Firebase Storage
      const storageRef = ref(storage, `documents/${user.telegramId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Aggiungi i metadati del documento a Firestore nella sottocollezione dell'utente
      await addDoc(collection(db, `users/${user.telegramId}/documents`), {
        fileName: file.name,
        fileType: metadata.type,
        url: downloadURL,
        createdAt: serverTimestamp()
      });

      // Redirect alla lista dei documenti
      router.push('/documents');
    } catch (error) {
      console.error('Error uploading document: ', error);
      // Qui puoi aggiungere un messaggio di errore per l'utente
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Carica Documento</h1>
      <div className="max-w-md mx-auto">
        <UploadForm onUpload={handleUpload} />
      </div>
    </Layout>
  );
}
