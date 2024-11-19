// pages/forum/new-post.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const categories = [
  { id: 'servizi', name: 'Servizi' },
  { id: 'investimenti', name: 'Investimenti' },
  { id: 'networking', name: 'Networking' },
  { id: 'altro', name: 'Altro' }
];

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert('Per favore, compila tutti i campi.');
      return;
    }

    if (!user || (user.plan !== 'vip' && user.plan !== 'admin')) {
      alert('Devi essere loggato e avere un piano VIP o Admin per creare un post.');
      return;
    }

    try {
      await addDoc(collection(db, 'forumPosts'), {
        title,
        content,
        category,
        authorId: user.telegramId,
        authorName: user.username || user.firstName || `User${user.telegramId}`,
        createdAt: serverTimestamp()
      });
      router.push(`/forum/category/${category}`);
    } catch (error) {
      console.error("Errore nella creazione del post: ", error);
      alert('Si è verificato un errore nella creazione del post. Riprova più tardi.');
    }
  };

  if (!user || (user.plan !== 'vip' && user.plan !== 'admin')) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Crea Nuovo Post</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleziona una categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Pubblica Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}