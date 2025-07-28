import React, { useEffect, useState, useRef, createElement } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    src: 'https://i.ibb.co/V0LL68LT/486835266-615250928172283-4047603257840771054-n.jpg',
    alt: 'Students enjoying a club event',
    reactions: {
      '🥰': 24,
      '😂': 0,
      '🔥': 32
    },
    type: 'image'
  },
  {
    id: 2,
    src: 'https://i.ibb.co/TB3HsQpK/491260197-636704766026899-2031246333511283258-n.jpg',
    alt: 'Students meditating outdoors',
    reactions: {
      '🥰': 42,
      '😂': 0,
      '🔥': 28
    },
    type: 'image'
  },
  {
    id: 3,
    src: 'https://i.ibb.co/5g8rmLq5/1747936328603.jpg',
    alt: 'Students enjoying a club event',
    reactions: {
      '🥰': 19,
      '😂': 0,
      '🔥': 15
    },
    type: 'image'
  },
  {
    id: 4,
    src: 'https://i.ibb.co/XxPfPN4r/484383399-604348892595820-1486979467841199384-n.jpg',
    alt: 'Students meditating outdoors',
    reactions: {
      '🥰': 36,
      '😂': 0,
      '🔥': 8
    },
    type: 'image'
  },
  {
    id: 5,
    src: 'https://i.ibb.co/m5P8v4Cb/1747936333343.jpg',
    alt: 'Students meditating outdoors',
    reactions: {
      '🥰': 36,
      '😂': 0,
      '🔥': 8
    },
    type: 'image'
  }
];

export const GallerySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userReactions, setUserReactions] = useState<Record<number, string | null>>({});
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleReaction = (imageId: number, emoji: string) => {
    setUserReactions(prev => {
      // If user already reacted with this emoji, remove it
      if (prev[imageId] === emoji) {
        const newReactions = { ...prev };
        delete newReactions[imageId];
        return newReactions;
      }
      // Otherwise set or update reaction
      return {
        ...prev,
        [imageId]: emoji
      };
    });

    // Update the image reactions count (simulated)
    const currentImage = galleryImages.find(img => img.id === imageId);
    if (currentImage && currentImage.reactions[emoji as keyof typeof currentImage.reactions]) {
      currentImage.reactions[emoji as keyof typeof currentImage.reactions] += 1;
    }

    // Create emoji burst effect
    createEmojiBurst(emoji);
  };

  const createEmojiBurst = (emoji: string) => {
    const container = document.querySelector('#gallery');
    if (!container) return;

    for (let i = 0; i < 8; i++) {
      const emojiEl = document.createElement('div');
      emojiEl.className = 'absolute text-2xl pointer-events-none';
      emojiEl.textContent = emoji;
      emojiEl.style.left = `${50 + (Math.random() * 40 - 20)}%`;
      emojiEl.style.top = `${50 + (Math.random() * 40 - 20)}%`;
      emojiEl.style.transform = `scale(0)`;
      emojiEl.style.opacity = '0';
      emojiEl.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      container.appendChild(emojiEl);

      // Animate out
      setTimeout(() => {
        emojiEl.style.transform = `scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 20}px) rotate(${Math.random() * 60 - 30}deg)`;
        emojiEl.style.opacity = '1';
      }, 10);

      // Remove after animation
      setTimeout(() => {
        emojiEl.style.opacity = '0';
        setTimeout(() => container.removeChild(emojiEl), 500);
      }, 800);
    }
  };

  // Set up autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  // Pause autoplay on hover
  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  // Resume autoplay on mouse leave
  const resumeAutoplay = () => {
    if (!autoplayRef.current) {
      autoplayRef.current = setInterval(nextSlide, 5000);
    }
  };

  // Add scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('animate-fadeIn');
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          // Animate child elements with staggered delays
          const titleSection = element.querySelector('.text-center') as HTMLElement;
          const galleryContainer = element.querySelector('.relative.max-w-5xl') as HTMLElement;
          
          if (titleSection) {
            setTimeout(() => {
              titleSection.style.opacity = '1';
              titleSection.style.transform = 'translateY(0)';
            }, 200);
          }
          
          if (galleryContainer) {
            setTimeout(() => {
              galleryContainer.style.opacity = '1';
              galleryContainer.style.transform = 'translateY(0) scale(1)';
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
    <section id="gallery" ref={sectionRef} className="py-16 md:py-20 px-4 bg-paper dark:bg-charcoal-800 relative overflow-hidden opacity-0 transform translate-y-8 transition-all duration-1000 ease-out">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full bg-chocolate-700/5 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full bg-mustard-500/5 blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16 opacity-0 transform translate-y-8 transition-all duration-1000 ease-out delay-200">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mt-2 mb-4 text-mustard-500 dark:text-white">
            Gallery
          </h2>
          <p className="text-charcoal-500 dark:text-cream-500 max-w-2xl mx-auto text-sm md:text-base">
            Moments of joy, creativity, and connection from our club activities.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto opacity-0 transform translate-y-8 scale-95 transition-all duration-1000 ease-out delay-300" onMouseEnter={pauseAutoplay} onMouseLeave={resumeAutoplay}>
          {/* Carousel */}
          <div className="overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
            <div 
              className="flex transition-transform duration-700 ease-out h-[50vh] md:h-[70vh]" 
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {galleryImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="min-w-full h-full relative" 
                  onMouseEnter={() => setHoveredImage(image.id)} 
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-900/70 via-transparent to-transparent"></div>
                  
                  {/* Emoji reactions floating up randomly */}
                  {hoveredImage === image.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      {Object.keys(image.reactions).map((emoji, i) => (
                        <div 
                          key={emoji} 
                          className="absolute text-lg md:text-2xl animate-float" 
                          style={{
                            left: `${20 + i * 20}%`,
                            bottom: '20%',
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: `${3 + i * 0.5}s`
                          }}
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                    <p className="font-medium text-base md:text-xl mb-3 md:mb-4">{image.alt}</p>
                    <div className="flex items-center space-x-2 md:space-x-4 flex-wrap">
                      {Object.entries(image.reactions).map(([emoji, count]) => (
                        <button 
                          key={emoji} 
                          className={`flex items-center space-x-1 md:space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full px-2 md:px-4 py-1 md:py-2 transition-all transform ${
                            userReactions[image.id] === emoji ? 'bg-white/30 scale-110 shadow-glow' : ''
                          }`} 
                          onClick={() => handleReaction(image.id, emoji)}
                        >
                          <span className="text-lg md:text-xl">{emoji}</span>
                          <span className="text-xs md:text-sm font-medium">
                            {count + (userReactions[image.id] === emoji ? 1 : 0)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button 
            onClick={prevSlide} 
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-chocolate-700/10 hover:bg-chocolate-700/20 backdrop-blur-md rounded-full p-2 md:p-3 text-chocolate-700 dark:text-white transition-all transform hover:scale-110" 
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-chocolate-700/10 hover:bg-chocolate-700/20 backdrop-blur-md rounded-full p-2 md:p-3 text-chocolate-700 dark:text-white transition-all transform hover:scale-110" 
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 md:mt-6 space-x-2">
            {galleryImages.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentSlide(index)} 
                className={`transition-all ${
                  currentSlide === index 
                    ? 'w-6 md:w-8 h-2 bg-chocolate-700 dark:bg-mustard-500' 
                    : 'w-2 h-2 bg-cream-600 dark:bg-charcoal-600 hover:bg-sand-300 dark:hover:bg-saddle-700'
                } rounded-full`} 
                aria-label={`Go to slide ${index + 1}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};