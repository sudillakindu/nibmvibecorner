import React, { useEffect, useState } from 'react';
import { MoonIcon, SunIcon, MenuIcon, XIcon, MusicIcon, UsersIcon, CalendarIcon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  scrolled: boolean;
}

export const Header = ({
  isDarkMode,
  setIsDarkMode,
  scrolled
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionId = section.getAttribute('id');
        if (sectionTop < 100 && sectionTop >= -section.clientHeight + 100) {
          if (sectionId) setActiveLink(sectionId);
        }
      });

      // Close mobile menu when scrolling
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '🎭' },
    { id: 'events', label: 'Events', icon: '🎵' },
    { id: 'gallery', label: 'Gallery', icon: '🎨' },
    { id: 'join', label: 'Join Us', icon: '✨' },
    { id: 'executive', label: 'Executive', icon: '🎯' }
  ];

  // Helper for smooth scroll with offset
  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();

    // Handle executive page navigation
    if (id === 'executive') {
      window.location.href = '/executive';
      return;
    }

    // If we're on the executive or join-us page and clicking other nav items, go to home first
    if (window.location.pathname === '/executive' || window.location.pathname === '/join-us') {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      const yOffset = -80; // Adjust this offset to match your header height
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? isDarkMode
          ? 'bg-chocolate-700/90 dark:bg-charcoal-900/90 backdrop-blur-md shadow-md py-2'
          : 'bg-white/90 backdrop-blur-md shadow-md py-2'
        : 'bg-transparent py-4'
      }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <h1
            className={`text-xl md:text-2xl font-bold transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'
              } ${isDarkMode
                ? 'text-white'
                : scrolled
                  ? 'text-chocolate-700'
                  : 'text-white'
              }`}
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/'}
          >
            <span className={`${scrolled ? 'text-mustard-500' : 'text-mustard-500'}`}>
              Vibe
            </span>
            Corner
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavClick(item.id)}
              className={`group relative flex flex-col items-center transition-colors ${activeLink === item.id
                  ? isDarkMode
                    ? 'text-mustard-500'
                    : scrolled
                      ? 'text-chocolate-700'
                      : 'text-mustard-500'
                  : isDarkMode
                    ? 'text-white hover:text-orange-500'
                    : scrolled
                      ? 'text-charcoal-500 hover:text-orange-500'
                      : 'text-white hover:text-sand-300'
                }`}
            >
              <span className="block text-lg mb-0.5 transition-transform group-hover:animate-pulse">
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100 ${activeLink === item.id
                  ? 'scale-x-100 bg-mustard-500'
                  : 'bg-orange-500'
                }`}></span>
            </a>
          ))}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${isDarkMode
                ? 'bg-saddle-800 text-mustard-500 hover:bg-saddle-700'
                : scrolled
                  ? 'bg-cream-500 text-chocolate-700 hover:bg-cream-600'
                  : 'bg-white/20 backdrop-blur-sm text-mustard-500 hover:bg-white/30'
              }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <SunIcon size={20} className="transition-transform hover:rotate-45" />
            ) : (
              <MoonIcon size={20} className="transition-transform hover:rotate-12" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-2">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${isDarkMode
                ? 'bg-saddle-800 text-mustard-500'
                : scrolled
                  ? 'bg-cream-500 text-chocolate-700'
                  : 'bg-white/20 backdrop-blur-sm text-mustard-500'
              }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${isDarkMode
                ? 'bg-saddle-800 text-white'
                : scrolled
                  ? 'bg-cream-500 text-chocolate-700'
                  : 'bg-white/20 backdrop-blur-sm text-white'
              } ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation with Cool Effects */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out mr-3 ml-3 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <nav className={`mt-2 ${isDarkMode
            ? 'bg-charcoal-800/95 backdrop-blur-md'
            : 'bg-white/95 backdrop-blur-md'
          } shadow-lg border-t border-white/10`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={handleNavClick(item.id)}
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-500 transform hover:scale-105 hover:shadow-md ${activeLink === item.id
                      ? isDarkMode
                        ? 'text-mustard-500 bg-mustard-500/10'
                        : 'text-chocolate-700 bg-chocolate-700/10'
                      : isDarkMode
                        ? 'text-white hover:text-orange-500 hover:bg-white/10'
                        : 'text-charcoal-500 hover:text-orange-500 hover:bg-charcoal-500/10'
                    }`}
                  style={{
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(50px)',
                    opacity: isMenuOpen ? 1 : 0,
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  <span className="text-xl mr-4 transition-transform duration-300 hover:scale-125 hover:rotate-12">
                    {item.icon}
                  </span>
                  <span className="font-semibold text-base">{item.label}</span>
                  {activeLink === item.id && (
                    <div className="ml-auto w-2 h-2 bg-mustard-500 rounded-full animate-pulse"></div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
