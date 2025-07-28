import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EventsSection } from './components/EventsSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { JoinSection } from './components/JoinSection';
import { SignIn } from './screen/SignIn';
import { SignUp } from './screen/SignUp';
import  Dashboard from './screen/dashboard/Dashboard';
import { Footer } from './components/Footer';
import { MusicToggle } from './components/MusicToggle';
import { WhatsAppButton } from './components/WhatsAppButton';
export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Check URL for routing
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/signin') {
      setCurrentPage('signin');
    } else if (path === '/signup') {
      setCurrentPage('signup');
    } else if (path === '/dashboard') {
      setCurrentPage('dashboard');
    } else if (path === '/join-us') {
      setCurrentPage('join-us');
    } else if (path === '/event') {
      setCurrentPage('event');
    } else {
      setCurrentPage('home');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDarkMode ? 'bg-charcoal-900 text-white' : 'bg-white text-charcoal-900'
      }`}>
      {currentPage === 'signin' ? (
        <SignIn />
      ) : currentPage === 'signup' ? (
        <SignUp />
      ) : currentPage === 'dashboard' ? (
        <Dashboard />
      ) : currentPage === 'join-us' ? (
        <>
          <main className="w-full">
            <JoinSection />
          </main>
          <MusicToggle />
          <WhatsAppButton />
          {/* Global confetti container for full-screen confetti */}
          <div id="confetti-container" className="fixed inset-0 pointer-events-none z-[9999]" />
        </>
      ) : (
        <>
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} scrolled={scrolled} />
          <main className="w-full">
            <HeroSection />
            <AboutSection />
            <EventsSection />
            <GallerySection />
            <JoinSection />
          </main>
          <Footer />
          <MusicToggle />
          <WhatsAppButton />
          {/* Global confetti container for full-screen confetti */}
          <div id="confetti-container" className="fixed inset-0 pointer-events-none z-[9999]" />
        </>
      )}
    </div>
  );
}