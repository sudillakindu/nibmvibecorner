import React, { useEffect, useRef } from 'react';

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('animate-fadeIn');
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          // Animate child elements with staggered delays
          const imageSection = element.querySelector('.order-2.lg\\:order-1') as HTMLElement;
          const contentSection = element.querySelector('.order-1.lg\\:order-2') as HTMLElement;
          
          if (imageSection) {
            setTimeout(() => {
              imageSection.style.opacity = '1';
              imageSection.style.transform = 'translateX(0)';
            }, 200);
          }
          
          if (contentSection) {
            setTimeout(() => {
              contentSection.style.opacity = '1';
              contentSection.style.transform = 'translateX(0)';
            }, 300);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-20 px-4 bg-paper dark:bg-charcoal-800 opacity-0 transform translate-y-8 transition-all duration-1000 ease-out">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image Section */}
          <div className="relative order-2 lg:order-1 opacity-0 transform translate-x-8 transition-all duration-1000 ease-out delay-200">
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-16 h-16 md:w-24 md:h-24 bg-mustard-500 rounded-full opacity-20"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-xl z-10">
              <img 
                src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Students laughing together" 
                className="w-full h-[300px] md:h-[500px] object-cover transition-transform hover:scale-105 duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-700/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 md:p-6 text-white">
                  <p className="text-base md:text-lg font-medium">
                    Building friendships that last a lifetime
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-20 h-20 md:w-32 md:h-32 bg-orange-500 rounded-full opacity-20"></div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 opacity-0 transform -translate-x-8 transition-all duration-1000 ease-out delay-300">
            
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mt-2 mb-4 md:mb-6 text-mustard-500 dark:text-white">
              We Create Spaces for Self-Expression
            </h2>
            
            <p className="text-charcoal-500 dark:text-cream-500 mb-6 md:mb-8 text-base md:text-lg">
              <strong>NIBM VibeCorner</strong> was founded with a simple mission: to provide university
              students with a safe space to express themselves, relieve stress,
              and find mental freedom through creative outlets like music,
              drama, and social activities.
            </p>
            
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-mustard-500/20 flex items-center justify-center text-xl md:text-2xl animate-pulse group-hover:bg-mustard-500/30 transition-colors">
                  🎵
                </div>
                <div className="ml-3 md:ml-4">
                  <h3 className="text-lg md:text-xl font-semibold mb-1 text-chocolate-700 dark:text-mustard-500 group-hover:text-gradient-mustard dark:group-hover:text-gradient-mustard transition-colors">
                    Music Expression
                  </h3>
                  <p className="text-sm md:text-base text-charcoal-500 dark:text-cream-500">
                    Weekly jam sessions and open mic nights to share your
                    musical talents and find your rhythm.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-xl md:text-2xl animate-pulse delay-75 group-hover:bg-orange-500/30 transition-colors">
                  🎭
                </div>
                <div className="ml-3 md:ml-4">
                  <h3 className="text-lg md:text-xl font-semibold mb-1 text-chocolate-700 dark:text-orange-400 group-hover:text-gradient-sand dark:group-hover:text-gradient-sand transition-colors">
                    Drama & Performance
                  </h3>
                  <p className="text-sm md:text-base text-charcoal-500 dark:text-cream-500">
                    Theater workshops and performances to help you break out of
                    your shell and discover new talents.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-sand-500/20 flex items-center justify-center text-xl md:text-2xl animate-pulse delay-150 group-hover:bg-sand-500/30 transition-colors">
                  🧠
                </div>
                <div className="ml-3 md:ml-4">
                  <h3 className="text-lg md:text-xl font-semibold mb-1 text-chocolate-700 dark:text-sand-400 group-hover:text-gradient-chocolate dark:group-hover:text-sand-300 transition-colors">
                    Mental Wellness
                  </h3>
                  <p className="text-sm md:text-base text-charcoal-500 dark:text-cream-500">
                    Meditation sessions and stress-relief activities to maintain
                    balance during academic pressures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};