// pages/elearning/course/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import LessonList from '../../../components/ELearning/LessonList';
import Loader from '@/components/Loader';

export default function Course() {
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && user && (user.plan === 'vip' || user.plan === 'admin')) {
      fetchCourse();
      fetchUserProgress();
    } else if (user && user.plan !== 'vip' && user.plan !== 'admin') {
      router.push('/');
    }
  }, [id, user, router]);

  const fetchCourse = async () => {
    if (!id) return;
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCourse({ id: docSnap.id, ...docSnap.data() });
    }
  };

  const fetchUserProgress = async () => {
    if (!id || !user) return;
    const progressRef = doc(db, 'users', user.uid, 'courseProgress', id);
    const progressSnap = await getDoc(progressRef);
    if (progressSnap.exists()) {
      setUserProgress(progressSnap.data());
    } else {
      // Inizializza il progresso dell'utente se non esiste
      const initialProgress = { completedLessons: [] };
      await setDoc(progressRef, initialProgress);
      setUserProgress(initialProgress);
    }
  };

  const updateProgress = async (lessonId) => {
    if (!id || !user) return;
    const updatedProgress = {
      ...userProgress,
      completedLessons: [...userProgress.completedLessons, lessonId]
    };
    const progressRef = doc(db, 'users', user.uid, 'courseProgress', id);
    await setDoc(progressRef, updatedProgress);
    setUserProgress(updatedProgress);
  };

  if (!course || !userProgress) {
    return <Loader />;  // Sostituisce "Caricamento..." con il loader trasparente
  }

  return (
    <Layout>
      <div className="bg-[#0C1A0E] min-h-screen rounded-lg p-4">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">{course.title}</h1>
          <p className="text-gray-400 mb-6">{course.description}</p>
          <LessonList 
            lessons={course.lessons} 
            completedLessons={userProgress.completedLessons}
            updateProgress={updateProgress}
          />
        </div>
      </div>
    </Layout>
  );
}