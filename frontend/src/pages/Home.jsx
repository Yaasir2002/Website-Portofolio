import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import api from '../services/api';

export default function Home() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Log general page view visit
    try {
      api.post('/analytics/log', { path: '/', referrer: document.referrer || 'Direct' });
    } catch (e) {
      // ignore
    }

    // Fetch site profile details
    const getProfileData = async () => {
      try {
        const res = await api.get('/auth/profile');
        setProfile(res.data);
      } catch (err) {
        console.log('Using default profile data');
      }
    };

    getProfileData();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans custom-cursor-active">
      <CustomCursor />
      <Navbar profile={profile} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Portfolio />
        <Skills profile={profile} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
