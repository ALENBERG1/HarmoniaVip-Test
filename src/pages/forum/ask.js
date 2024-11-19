// pages/forum/ask.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const categories = ['Supporto', 'Investimento', 'Prodotti', 'Servizi', 'Network'];

export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user || (user.plan !== 'vip' && user.plan !== 'admin')) {
      alert('Devi essere loggato e avere un piano VIP o Admin per fare una domanda.');
      return;
    }

    try {
        await addDoc(collection(db, 'forum_questions'), {
          title,
          content,
          category,
          authorId: user.telegramId,
          authorName: user.username || user.firstName || `User${user.telegramId}`,
          createdAt: serverTimestamp(),
        });

        router.push(`/forum/category/${category.toLowerCase()}`);
    } catch (error) {
      console.error('Error adding question: ', error);
      alert('Si è verificato un errore durante l\'invio della domanda. Riprova più tardi.');
    }
  };

  if (!user || (user.plan !== 'vip' && user.plan !== 'admin')) {
    return <Layout><div className="text-white">Accesso non autorizzato.</div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-[#0C1A0E] rounded-lg p-4 min-h-screen text-white">
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold mb-6">Fai una domanda</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Titolo
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Seleziona una categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                Contenuto
              </label>
              <textarea
                id="content"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C29022] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Invia domanda
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}