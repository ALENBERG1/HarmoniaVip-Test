import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Loader from '../components/Loader';
import HeroSection from '../components/Home/HeroSection';
import OpportunitiesSection from '../components/Home/OpportunitiesSection';
import SocialSharingSection from '../components/Home/SocialSharingSection';
import Footer from '../components/Home/Footer';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <Head>
        <title>Harmonya Manager Platform - La piattaforma per i manager di Harmonya</title>
        <meta name="description" content="Unisciti alla rivoluzione del networking con Harmonya" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#0c0c0c] text-white">
        <HeroSection />
        <OpportunitiesSection />
        <SocialSharingSection />
        <Footer />
      </div>
    </Layout>
  );
}
