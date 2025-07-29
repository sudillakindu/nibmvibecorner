import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, Clock, MapPin, Users, MicIcon, Music, Palette, Heart, X, Flag } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebase';

// Custom CSS for hiding scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }
`;

interface Event {
  id: string;
  eventId: string;
  eventName: string;
  description: string;
  imageUrl?: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  status: string;
  organizedBy: string;
  registrationRequired: boolean;
  registrationDeadline: string;
  maxParticipants: number;
  contactPerson: string;
  isActive: boolean;
  createdAt: string;
}

// Event type configurations with JoinSection color scheme
const eventTypeConfig = {
  'music': { icon: Music, emoji: '🎵', color: 'from-chocolate-700 to-mustard-600', textColor: 'text-chocolate-700', bgColor: 'bg-chocolate-700/10' },
  'competition': { icon: Users, emoji: '🏆', color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-500/10' },
  'hackathon': { icon: Users, emoji: '💻', color: 'from-blue-600 to-purple-600', textColor: 'text-blue-600', bgColor: 'bg-blue-600/10' },
  'debate': { icon: Users, emoji: '🗣️', color: 'from-red-500 to-pink-500', textColor: 'text-red-600', bgColor: 'bg-red-500/10' },
  'exhibition': { icon: Users, emoji: '🖼️', color: 'from-green-500 to-teal-500', textColor: 'text-green-600', bgColor: 'bg-green-500/10' },
  'theater': { icon: Users, emoji: '🎭', color: 'from-purple-600 to-indigo-600', textColor: 'text-purple-600', bgColor: 'bg-purple-600/10' },
  'sports': { icon: Users, emoji: '⚽', color: 'from-emerald-500 to-green-600', textColor: 'text-emerald-600', bgColor: 'bg-emerald-500/10' },
  'workshop': { icon: Users, emoji: '🔧', color: 'from-chocolate-800 to-saddle-800', textColor: 'text-chocolate-800', bgColor: 'bg-chocolate-800/10' },
  'art': { icon: Palette, emoji: '🎨', color: 'from-mustard-500 to-orange-500', textColor: 'text-mustard-600', bgColor: 'bg-mustard-500/10' },
  'drama': { icon: Users, emoji: '🎭', color: 'from-saddle-700 to-chocolate-800', textColor: 'text-saddle-700', bgColor: 'bg-saddle-700/10' },
  'meditation': { icon: Heart, emoji: '🧘', color: 'from-chocolate-600 to-saddle-600', textColor: 'text-chocolate-600', bgColor: 'bg-chocolate-600/10' },
  'open-mic': { icon: MicIcon, emoji: '🎤', color: 'from-orange-500 to-mustard-500', textColor: 'text-orange-500', bgColor: 'bg-orange-500/10' }
};

export const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = ref(database, 'events');
        const snapshot = await get(eventsRef);
        
        if (snapshot.exists()) {
          const eventsData = snapshot.val();
          const eventsArray = Object.keys(eventsData).map(key => ({
            id: key,
            ...eventsData[key]
          }));
          // Filter out past events and sort by date (earliest first)
          const currentDate = new Date();
          const currentDateTime = currentDate.getTime();
          
          const filteredAndSortedEvents = eventsArray
            .filter(event => {
              // Create a date object for the event's end date and time
              const eventEndDateTime = new Date(`${event.eventDate}T${event.endTime}`);
              const isNotEnded = eventEndDateTime.getTime() > currentDateTime;
              const isActive = event.isActive === true; // Only show active events
              return isNotEnded && isActive;
            })
            .sort((a, b) => {
              const dateA = new Date(a.eventDate);
              const dateB = new Date(b.eventDate);
              return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 8); // Limit to maximum 8 events
          
          setEvents(filteredAndSortedEvents);
        }
      } catch (error) {
        // console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !loading && events.length > 0) {
          const element = entry.target as HTMLElement;
          element.classList.add('animate-fadeIn');
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          // Animate child elements with staggered delays
          const titleSection = element.querySelector('.text-center') as HTMLElement;
          const eventsGrid = element.querySelector('.grid') as HTMLElement;
          
          if (titleSection) {
            setTimeout(() => {
              titleSection.style.opacity = '1';
              titleSection.style.transform = 'translateY(0)';
            }, 200);
          }
          
          if (eventsGrid) {
            const eventCards = eventsGrid.querySelectorAll('.group');
            eventCards.forEach((card, index) => {
              setTimeout(() => {
                (card as HTMLElement).style.opacity = '1';
                (card as HTMLElement).style.transform = 'translateY(0) scale(1)';
              }, 300 + (index * 100)); // Stagger each card by 100ms
            });
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
  }, [loading, events.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getEventConfig = (eventType: string) => {
    return eventTypeConfig[eventType as keyof typeof eventTypeConfig] || eventTypeConfig['workshop'];
  };

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <section id="events" className="py-12 md:py-20 px-4 bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chocolate-700 dark:border-mustard-500 mx-auto"></div>
            <p className="mt-4 text-charcoal-600 dark:text-cream-400">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />
      <section id="events" ref={sectionRef} className={`py-12 md:py-20 px-4 bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20 relative overflow-hidden transition-all duration-1000 ease-out ${loading ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
      {/* Enhanced decorative elements - matching JoinSection */}
      <div className="absolute top-10 left-5 w-40 h-40 md:w-80 md:h-80 rounded-full bg-chocolate-700/10 blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-5 w-60 h-60 md:w-96 md:h-96 rounded-full bg-mustard-500/10 blur-3xl animate-float-delay"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-orange-500/5 blur-2xl animate-float-slow"></div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-1000 ease-out delay-200 ${loading ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 pb-2 bg-gradient-to-r from-chocolate-700 to-mustard-600 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <p className="text-lg md:text-xl text-charcoal-600 dark:text-cream-400 max-w-3xl mx-auto leading-relaxed">
            Join us for these exciting events designed to help you unwind,
            express yourself, and connect with others.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {events.map((event, index) => {
            const config = getEventConfig(event.eventType);
            const IconComponent = config.icon;
            
            return (
            <div 
              key={event.id} 
              className={`group relative backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-white/30 dark:border-chocolate-700/30 hover:border-mustard-300 dark:hover:border-mustard-600 transition-all duration-700 ease-out ${loading ? 'opacity-100' : 'opacity-0 transform translate-y-8 scale-95'}`}
              style={{ transitionDelay: loading ? '0ms' : `${300 + (index * 100)}ms` }}
            >
              {/* Event Type Badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${config.color} shadow-lg`}>
                  {event.eventType.replace('-', ' ').toUpperCase()}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'upcoming' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                  event.status === 'ongoing' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white' :
                  'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                } shadow-lg`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>

              {/* Header Image */}
              <div className={`relative h-48 bg-gradient-to-br ${config.color} overflow-hidden`}>
                {event.imageUrl ? (
                  <img 
                    src={event.imageUrl} 
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                  {config.emoji}
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {event.eventName}
                  </h3>
                  <div className="flex items-center text-white/90 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.organizedBy}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Description */}
                <p className="text-sm text-charcoal-600 dark:text-cream-400 mb-4 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-charcoal-500 dark:text-cream-500">
                    <CalendarIcon className="w-4 h-4 mr-3 text-chocolate-700 dark:text-mustard-500" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-charcoal-500 dark:text-cream-500">
                    <Clock className="w-4 h-4 mr-3 text-chocolate-700 dark:text-mustard-500" />
                    <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-charcoal-500 dark:text-cream-500">
                    <MapPin className="w-4 h-4 mr-3 text-chocolate-700 dark:text-mustard-500" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleLearnMore(event)}
                  className="w-full bg-gradient-to-r from-mustard-500 to-orange-500 hover:from-mustard-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group/btn shadow-md"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-white/90 dark:bg-charcoal-900/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/30 dark:border-chocolate-700/30 shadow-2xl scrollbar-hide">
            <div className="relative">
              {/* Header */}
              <div className={`h-48 bg-gradient-to-br ${getEventConfig(selectedEvent.eventType).color} p-6 relative overflow-hidden`}>
                {selectedEvent.imageUrl && (
                  <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.eventName}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-black/20 rounded-full p-2 backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-end h-full">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {selectedEvent.eventName}
                    </h2>
                    <div className="flex items-center text-white/90">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{selectedEvent.organizedBy}</span>
                    </div>
                  </div>
                </div>
                <span className="absolute top-4 left-4 text-4xl">
                  {getEventConfig(selectedEvent.eventType).emoji}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-chocolate-700 dark:text-mustard-400 mb-3">
                    About This Event
                  </h3>
                  <p className="text-charcoal-600 dark:text-cream-400 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                    <CalendarIcon className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                    <div>
                      <p className="text-sm text-charcoal-500 dark:text-cream-400">Event Date</p>
                      <p className="font-medium text-chocolate-700 dark:text-white">
                        {formatDate(selectedEvent.eventDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                    <Clock className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                    <div>
                      <p className="text-sm text-charcoal-500 dark:text-cream-400">Time</p>
                      <p className="font-medium text-chocolate-700 dark:text-white">
                        {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                    <MapPin className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                    <div>
                      <p className="text-sm text-charcoal-500 dark:text-cream-400">Venue</p>
                      <p className="font-medium text-chocolate-700 dark:text-white">
                        {selectedEvent.venue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                    <Users className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                    <div>
                      <p className="text-sm text-charcoal-500 dark:text-cream-400">Contact Person</p>
                      <p className="font-medium text-chocolate-700 dark:text-white">
                        {selectedEvent.contactPerson}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                    <Users className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                    <div>
                      <p className="text-sm text-charcoal-500 dark:text-cream-400">Event Type</p>
                      <p className="font-medium text-chocolate-700 dark:text-white capitalize">
                        {selectedEvent.eventType.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                    <Flag className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                    <div>
                      <p className="text-sm text-charcoal-500 dark:text-cream-400">Status</p>
                      <p className="font-medium text-chocolate-700 dark:text-white capitalize">
                        {selectedEvent.status}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.registrationRequired && (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                        <CalendarIcon className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                        <div>
                          <p className="text-sm text-charcoal-500 dark:text-cream-400">Registration Deadline</p>
                          <p className="font-medium text-chocolate-700 dark:text-white">
                            {selectedEvent.registrationDeadline ? formatDate(selectedEvent.registrationDeadline) : 'Not set'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-cream-50/80 dark:bg-charcoal-800/80 rounded-xl border border-cream-200/50 dark:border-charcoal-700/50 backdrop-blur-sm">
                        <Users className="w-5 h-5 text-chocolate-700 dark:text-mustard-500" />
                        <div>
                          <p className="text-sm text-charcoal-500 dark:text-cream-400">Max Participants</p>
                          <p className="font-medium text-chocolate-700 dark:text-white">
                            {selectedEvent.maxParticipants || 'Unlimited'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gradient-to-r from-cream-100 to-cream-200 dark:from-charcoal-700 dark:to-charcoal-800 text-chocolate-700 dark:text-cream-300 py-3 px-6 rounded-xl font-medium hover:from-cream-200 hover:to-cream-300 dark:hover:from-charcoal-600 dark:hover:to-charcoal-700 transition-all transform hover:scale-105 border border-cream-300 dark:border-charcoal-600 shadow-md"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-mustard-500 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-mustard-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md">
                    Join Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </section>
    </>
  );
};