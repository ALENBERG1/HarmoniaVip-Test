// pages/forum/question/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '@/components/Loader';

export default function QuestionDetail() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchQuestionAndAnswers = async () => {
        // Fetch question
        const questionDoc = await getDoc(doc(db, 'forum_questions', id));
        if (questionDoc.exists()) {
          setQuestion({ id: questionDoc.id, ...questionDoc.data() });
        } else {
          console.log('No such question!');
          router.push('/forum');
          return;
        }

        // Fetch answers
        const answersQuery = query(
          collection(db, 'forum_questions', id, 'answers'),
          orderBy('createdAt', 'asc')
        );
        const answersSnapshot = await getDocs(answersQuery);
        const answersList = answersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnswers(answersList);

        setLoading(false);
      };

      fetchQuestionAndAnswers();
    }
  }, [id, router]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Devi essere loggato per rispondere.');
      return;
    }

    try {
      const answerData = {
        content: newAnswer,
        authorId: user.telegramId,
        authorName: user.username || user.firstName || `User${user.telegramId}`,
        authorStatus: user.status || 'Utente',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'forum_questions', id, 'answers'), answerData);
      setAnswers([...answers, { ...answerData, id: Date.now().toString() }]); // Optimistic update
      setNewAnswer('');
    } catch (error) {
      console.error('Error adding answer: ', error);
      alert('Si è verificato un errore durante l\'invio della risposta. Riprova più tardi.');
    }
  };

  if (loading) {
    return <Loader />;  // Sostituisce "Caricamento..." con il loader trasparente
  }

  if (!question) {
    return <Layout><div className="text-white">Domanda non trovata</div></Layout>;
  }

  return (
    <Layout>
      <div className="bg-[#0C1A0E] rounded-lg p-4 min-h-screen text-white">
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold mb-2 break-words">{question.title}</h1>
          <p className="text-sm text-gray-400 mb-4">
            Categoria: {question.category} | Da: {question.authorName} | 
            {new Date(question.createdAt.seconds * 1000).toLocaleDateString()}
          </p>
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <p>{question.content}</p>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Risposte</h2>
          {answers.length === 0 ? (
            <p className="text-gray-400 mb-4">Non ci sono ancora risposte a questa domanda.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {answers.map((answer) => (
                <div key={answer.id} className="bg-gray-800 p-4 rounded-lg">
                  <p>{answer.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Da: {answer.authorName} ({answer.authorStatus}) | 
                    {new Date(answer.createdAt.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitAnswer} className="mt-6">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Scrivi la tua risposta..."
              className="w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="mt-2 w-full bg-[#C29022] text-white px-4 py-2 rounded transition duration-200"
            >
              Invia risposta
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}