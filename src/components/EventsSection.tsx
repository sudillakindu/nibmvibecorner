import React from 'react';
import { CalendarIcon, MicIcon, UsersIcon, TheaterIcon } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Open Mic Night',
    date: 'October 15, 2023',
    description: 'Share your talents, poetry, or thoughts in our safe space open mic session.',
    icon: <MicIcon className="w-6 h-6" />,
    emoji: '🎤',
    color: 'from-orange-500 to-sand-600',
    textColor: 'text-orange-500'
  },
  {
    id: 2,
    title: 'Drama Day',
    date: 'October 22, 2023',
    description: 'Express yourself through theatrical performances and interactive drama workshops.',
    icon: <TheaterIcon className="w-6 h-6" />,
    emoji: '🎭',
    color: 'from-chocolate-700 to-saddle-700',
    textColor: 'text-chocolate-700'
  },
  {
    id: 3,
    title: 'Meditation Session',
    date: 'October 29, 2023',
    description: 'Learn mindfulness techniques to help manage stress and improve mental clarity.',
    icon: <UsersIcon className="w-6 h-6" />,
    emoji: '🧘',
    color: 'from-mustard-500 to-orange-500',
    textColor: 'text-mustard-500'
  },
  {
    id: 4,
    title: 'Music Therapy',
    date: 'November 5, 2023',
    description: 'Experience the healing power of music with our guided music therapy session.',
    icon: <CalendarIcon className="w-6 h-6" />,
    emoji: '🎶',
    color: 'from-sand-600 to-sand-700',
    textColor: 'text-sand-600'
  }
];

export const EventsSection = () => {
  return (
    <section id="events" className="py-16 md:py-24 px-4 bg-white dark:bg-charcoal-900">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center mb-2 bg-cream-500 dark:bg-saddle-900/30 px-3 md:px-4 py-1 md:py-1.5 rounded-full">
            <span className="text-lg md:text-xl mr-2">📅</span>
            <span className="text-chocolate-700 dark:text-sand-300 text-xs md:text-sm font-medium">
              What's Happening
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mt-2 mb-4 text-mustard-500 dark:text-white">
            Upcoming Events
          </h2>
          <p className="text-charcoal-500 dark:text-cream-500 max-w-2xl mx-auto text-sm md:text-base">
            Join us for these exciting events designed to help you unwind,
            express yourself, and connect with others.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {events.map(event => (
            <div 
              key={event.id} 
              className="bg-white dark:bg-charcoal-800 rounded-2xl overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-xl group border border-cream-500 dark:border-charcoal-700 hover:border-sand-300 dark:hover:border-saddle-900"
            >
              <div className={`relative h-40 md:h-48 bg-gradient-to-br ${event.color} p-4 md:p-6 flex items-end`}>
                <span className="absolute top-3 right-3 md:top-4 md:right-4 text-2xl md:text-4xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {event.emoji}
                </span>
                <div className="z-10">
                  <h3 className="text-lg md:text-2xl font-bold mb-1 text-white">
                    {event.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/90 flex items-center">
                    <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> 
                    {event.date}
                  </p>
                </div>
              </div>
              
              <div className="p-4 md:p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-cream-500/50 to-transparent dark:from-saddle-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-xs md:text-sm text-charcoal-500 dark:text-cream-500 mb-4 md:mb-6 relative z-10">
                  {event.description}
                </p>
                <button className={`${event.textColor} dark:text-white font-medium group-hover:text-chocolate-700 dark:group-hover:text-mustard-500 transition-colors inline-flex items-center relative z-10 text-xs md:text-sm`}>
                  Learn more
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};