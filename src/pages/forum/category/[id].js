// pages/forum/category/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function ForumCategory() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (user && (user.plan === 'vip' || user.plan === 'admin') && id) {
      fetchQuestions();
    } else if (user && user.plan !== 'vip' && user.plan !== 'admin') {
      router.push('/');
    }
  }, [user, id, router]);

  const fetchQuestions = async () => {
    try {
      const questionsRef = collection(db, 'forum_questions');
      const q = query(
        questionsRef,
        where('category', '==', id.charAt(0).toUpperCase() + id.slice(1)), // Capitalize first letter
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() || 'Data non disponibile'
      }));
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;  // Sostituisce "Caricamento..." con il loader trasparente
  }

  if (!user || (user.plan !== 'vip' && user.plan !== 'admin')) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-[#0C1A0E] rounded-lg p-4 min-h-screen">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Forum - {id.charAt(0).toUpperCase() + id.slice(1)}</h1>
          <Link href="/forum/ask">
            <a className="bg-[#C29022] text-white py-2 px-4 rounded transition duration-300 mb-6 inline-block">
              Fai una domanda
            </a>
          </Link>
          {questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                  <Link href={`/forum/question/${question.id}`}>
                    <a className="text-xl font-bold text-white hover:text-blue-400 transition duration-300 break-words">
                      {question.title}
                    </a>
                  </Link>
                  <p className="text-gray-400 mt-2">{question.content.substring(0, 150)}...</p>
                  <div className="mt-4 text-sm text-gray-500">
                    Creato da: {question.authorName} | {question.createdAt}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">Nessuna domanda in questa categoria.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}