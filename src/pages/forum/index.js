import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Loader from '@/components/Loader';

const categories = ['Supporto', 'Investimento', 'Prodotti', 'Servizi', 'Network'];

export default function Forum() {
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.plan === 'vip' || user.plan === 'admin') {
        fetchRecentQuestions();
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const fetchRecentQuestions = async () => {
    try {
      const q = query(collection(db, 'forum_questions'), orderBy('createdAt', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const questions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'Data non disponibile',
      }));
      setRecentQuestions(questions);
    } catch (error) {
      console.error("Error fetching recent questions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user || (user.plan !== 'vip' && user.plan !== 'admin')) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-[#0c0c0c] min-h-screen">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Forum</h1>

          {/* Griglia delle categorie */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {categories.map((category) => (
              <Link key={category} href={`/forum/category/${category.toLowerCase()}`}>
                <a className="bg-[#0C1A0E] p-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white text-center">{category}</h3>
                </a>
              </Link>
            ))}
          </div>

          {/* Domande recenti */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Domande Recenti</h2>
            {recentQuestions.length > 0 ? (
              <ul className="space-y-4">
                {recentQuestions.map((question) => (
                  <li key={question.id} className="bg-[#0C1A0E] p-4 rounded-lg shadow-md">
                    <Link href={`/forum/question/${question.id}`}>
                      <a className="block text-xl font-bold text-white hover:text-blue-400 transition duration-300 break-words sm:truncate">
                        {question.title}
                      </a>
                    </Link>
                    <p className="text-gray-400 mt-2">{question.content.substring(0, 100)}...</p>
                    <p className="text-sm text-gray-500 mt-2">Categoria: {question.category}</p>
                    <p className="text-sm text-gray-500">Creato il: {question.createdAt}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white">Nessuna domanda recente.</p>
            )}
          </div>

          <div className="mt-8">
            <Link href="/forum/ask">
              <a className="bg-[#C29022] text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                Fai una domanda
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}