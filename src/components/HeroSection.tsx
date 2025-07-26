import React, { useEffect, useState } from 'react';

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Smooth scroll function
  const handleSmoothScroll = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -80; // Adjust this offset to match your header height
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-chocolate-700 to-saddle-700 dark:from-charcoal-900 dark:to-saddle-900 overflow-hidden md:pt-16">
      {/* Video or image background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate-700/80 to-charcoal-900/90 dark:from-charcoal-900/90 dark:to-saddle-900/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
          alt="Students collaborating" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      </div>

      {/* Abstract decorative elements */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-mustard-500/20 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-orange-500/20 blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/4 left-1/4 w-8 h-8 md:w-16 md:h-16 rounded-full bg-mustard-500/30 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 md:w-24 md:h-24 rounded-full bg-orange-500/30 animate-float-delay"></div>
        <div className="absolute top-2/3 left-1/3 w-6 h-6 md:w-12 md:h-12 rounded-full bg-sand-500/20 animate-float-slow"></div>
      </div>

      {/* Content */}
      <div className={`container mx-auto px-4 z-20 text-center transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="relative inline-block mb-6 md:mb-6">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white break-words">
            <span className="text-gradient-mustard font-serif">Libe</span>rate
          </h1>
          <div className="absolute -bottom-6 -right-2 md:-bottom-7 md:-right-4 w-8 h-8 md:w-12 md:h-12 text-xl md:text-3xl animate-float">
            ✨
          </div>
          <div className="absolute -top-3 -left-2 md:-top-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 text-xl md:text-3xl animate-float-delay">
            🎭
          </div>
        </div>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-4 md:mb-8 text-sand-200 max-w-3xl mx-auto font-light px-4">
          සන්සුන් මොහොතක්... මනසට නිදහසක්... සරසවියට ආදරයක්...
        </p>
        
        <p className="text-sm sm:text-md md:text-lg mb-6 md:mb-12 text-white/80 max-w-2xl mx-auto px-4">
          Find your peace in the rhythm of music, the power of drama and the warmth of togetherness.
          Join our club for a stress-free student life.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
          <a 
            href="#join" 
            onClick={handleSmoothScroll('join')}
            className="group px-6 sm:px-10 py-3 sm:py-4 bg-mustard-500 text-chocolate-700 font-medium rounded-full hover:shadow-glow transition-all transform hover:scale-105 hover:bg-mustard-400 relative overflow-hidden text-sm sm:text-base cursor-pointer"
          >
            <span className="relative z-10">Join Now</span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-mustard-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </a>
          <a 
            href="#events" 
            onClick={handleSmoothScroll('events')}
            className="px-6 sm:px-10 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-lg hover:border-mustard-500/50 text-sm sm:text-base cursor-pointer"
          >
            Explore Events
          </a>
        </div>
        
        <div className="mt-8 md:mt-20 animate-bounce">
          <a href="#about" onClick={handleSmoothScroll('about')} aria-label="Scroll down" className="cursor-pointer">
            <svg className="w-6 h-6 mx-auto text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};