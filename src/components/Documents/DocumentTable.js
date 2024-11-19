import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { storage } from '../../lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const categories = ['Tutti', 'Presentazione', 'Documenti', 'Informazioni', 'Immagini', 'Tutorial'];

export default function DocumentTable({ documents }) {
  const [filter, setFilter] = useState('Tutti');

  const filteredDocuments = filter === 'Tutti' 
    ? documents 
    : documents.filter(doc => doc.category === filter);

  const handleDownload = async (fileName, category) => {
    try {
      const fileRef = ref(storage, `documents/${category}/${fileName}`);
      const url = await getDownloadURL(fileRef);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Errore durante il download del file:', error);
      alert('Si è verificato un errore durante il download del file.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Filtra per categoria</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-300"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-700 rounded-lg p-4">
        <thead className="bg-gray-800 rounded-lg p-4">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome File</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoria</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Caricato da</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data Caricamento</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Azioni</th>
          </tr>
        </thead>
        <tbody className="bg-[#0C1A0E] divide-y divide-gray-700">
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{doc.fileName || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{doc.category || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{doc.uploadedBy || 'Utente sconosciuto'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {doc.createdAt && formatDistanceToNow(doc.createdAt, { addSuffix: true, locale: it })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 mr-4">Visualizza</a>
                <button 
                  onClick={() => handleDownload(doc.fileName, doc.category)}
                  className="text-green-400 hover:text-green-300"
                >
                  Scarica
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}