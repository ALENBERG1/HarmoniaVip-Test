import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import CourseList from '../components/ELearning/CourseList';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Loader from '@/components/Loader';

export default function ELearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.plan === 'vip' || user.plan === 'admin') {
        fetchCourses();
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesData = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.plan !== 'vip' && user.plan !== 'admin')) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="bg-[#0C0C0C] min-h-screen">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#F0EDE5] mb-6">Piattaforma E-Learning</h1>
          {courses.length > 0 ? (
            <CourseList courses={courses} />
          ) : (
            <p className="text-[#F0EDE5]">Nessun corso disponibile al momento.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}