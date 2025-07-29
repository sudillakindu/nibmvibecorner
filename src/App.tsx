import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EventsSection } from './components/EventsSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { JoinSection } from './components/JoinSection';
import { SignIn } from './screen/SignIn';
import { SignUp } from './screen/SignUp';
import  Dashboard from './screen/Dashboard';
import { ExecutiveMember } from './screen/ExecutiveMember';
import { Footer } from './components/Footer';
import { MusicToggle } from './components/MusicToggle';
import { WhatsAppButton } from './components/WhatsAppButton';
export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check URL for routing
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/signin') {
      setCurrentPage('signin');
    } else if (path === '/signup12563') {
      setCurrentPage('signup');
    } else if (path === '/dashboard') {
      // Check if user is authorized to access dashboard
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        const userRole = userData.role?.toLowerCase();
        const adminRoles = ['president', 'student_coordinator', 'social_media_manager'];
        
        if (adminRoles.includes(userRole)) {
          setCurrentPage('dashboard');
          setIsAuthorized(true);
        } else {
          // Redirect unauthorized users to home page
          window.location.href = '/';
          return;
        }
      } else {
        // No user logged in, redirect to signin
        window.location.href = '/signin';
        return;
      }
    } else if (path === '/join-us') {
      setCurrentPage('join-us');
      setScrolled(true); // Set scrolled to true for white navigation background
    } else if (path === '/executive') {
      setCurrentPage('executive');
      setScrolled(true); // Set scrolled to true for white navigation background
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Handle hash navigation for smooth scrolling to sections
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash && currentPage === 'home') {
        const sectionId = hash.substring(1); // Remove the # symbol
        const section = document.getElementById(sectionId);
        if (section) {
          setTimeout(() => {
            const yOffset = -80; // Adjust this offset to match your header height
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }, 100); // Small delay to ensure page is rendered
        }
      }
    };

    handleHashNavigation();
  }, [currentPage]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (currentPage === 'executive' || currentPage === 'join-us') {
        // Always keep scrolled true for executive and join-us pages to maintain white background
        setScrolled(true);
      } else {
        // Normal scroll behavior for other pages
        if (window.scrollY > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

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
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} scrolled={scrolled} />
          <main className="w-full py-8 md:py-10">
            <JoinSection />
          </main>
          <Footer />
          <MusicToggle />
          <WhatsAppButton />
          {/* Global confetti container for full-screen confetti */}
          <div id="confetti-container" className="fixed inset-0 pointer-events-none z-[9999]" />
        </>
      ) : currentPage === 'executive' ? (
        <>
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} scrolled={scrolled} />
          <main className="w-full">
            <ExecutiveMember />
          </main>
          <Footer />
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