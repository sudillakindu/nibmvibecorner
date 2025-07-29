import React, { useState, useEffect, useRef } from 'react';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/firebase';
import { MusicToggle } from '../components/MusicToggle';
import { WhatsAppButton } from '../components/WhatsAppButton';

interface ExecutiveMember {
  profilePicture: string;
  fullName: string;
  role: string;
  faculty: string;
  year: string;
  email: string;
  linkedin: string;
}

export const ExecutiveMember: React.FC = () => {
  const [executiveMembers, setExecutiveMembers] = useState<ExecutiveMember[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Function to format role names for display
  const formatRoleName = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'president': 'President',
      'vice_president': 'Vice President',
      'student_coordinator': 'Student Coordinator',
      'secretary': 'Secretary',
      'assistant_secretary': 'Assistant Secretary',
      'treasurer': 'Treasurer',
      'social_media_manager': 'Social Media Manager',
      'editor': 'Editor',
      'committee_member': 'Committee Member'
    };
    return roleMap[role.toLowerCase()] || role;
  };

  useEffect(() => {
    const fetchExecutiveMembers = async () => {
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const members: ExecutiveMember[] = [];
          const roleOrder = [
            'president',
            'vice_president', 
            'student_coordinator',
            'secretary',
            'assistant_secretary',
            'treasurer',
            'social_media_manager',
            'editor',
            'committee_member'
          ];

          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            const userRole = userData.role?.toLowerCase() || '';
            
            // Only include users with the specified roles
            if (roleOrder.includes(userRole)) {
              members.push({
                profilePicture: userData.profilePicture || '/image/profile.png',
                fullName: userData.fullName || 'Unknown',
                role: userData.role || 'Member',
                faculty: userData.faculty || 'Not specified',
                year: userData.year || 'Not specified',
                email: userData.email || '',
                linkedin: userData.linkedin || ''
              });
            }
          });

          // Sort members by role order
          members.sort((a, b) => {
            const aIndex = roleOrder.indexOf(a.role.toLowerCase());
            const bIndex = roleOrder.indexOf(b.role.toLowerCase());
            return aIndex - bIndex;
          });

          setExecutiveMembers(members);
        } else {
          // No users found
          setExecutiveMembers([]);
        }
      } catch (error) {
        // console.error('Error fetching users:', error);
        // No fallback data - show empty state
        setExecutiveMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutiveMembers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !loading && executiveMembers.length > 0) {
          const element = entry.target as HTMLElement;
          element.classList.add('animate-fadeIn');
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          // Animate child elements with staggered delays
          const titleSection = element.querySelector('.text-center') as HTMLElement;
          const membersGrid = element.querySelector('.grid') as HTMLElement;
          
          if (titleSection) {
            setTimeout(() => {
              titleSection.style.opacity = '1';
              titleSection.style.transform = 'translateY(0)';
            }, 200);
          }
          
          if (membersGrid) {
            const memberCards = membersGrid.querySelectorAll('.group');
            memberCards.forEach((card, index) => {
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
  }, [loading, executiveMembers.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20">
      <main ref={sectionRef} className={`py-24 md:py-32 px-4 bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20 relative overflow-hidden transition-all duration-1000 ease-out ${loading ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
        {/* Hero Section */}

          {/* Enhanced decorative elements */}
        <section>
          <div className="absolute top-10 left-5 w-40 h-40 md:w-80 md:h-80 rounded-full bg-chocolate-700/10 blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-5 w-60 h-60 md:w-96 md:h-96 rounded-full bg-mustard-500/10 blur-3xl animate-float-delay"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-orange-500/5 blur-2xl animate-float-slow"></div>

          <div className="container mx-auto relative z-10 max-w-6xl">
            <div className={`text-center mb-8 md:mb-12 transition-all duration-1000 ease-out delay-200 ${loading ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-chocolate-700 to-mustard-600 bg-clip-text text-transparent">
                Executive Members
              </h1>
              <p className="text-lg md:text-xl text-charcoal-600 dark:text-cream-400 max-w-3xl mx-auto leading-relaxed">
                Meet the dedicated team of executive members who lead our vibrant community 
                and work tirelessly to create an inclusive space for creative expression and mental wellness.
              </p>
            </div>
          </div>
        </section>


        {/* Executive Members Grid */}
        <section>
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mustard-500 mx-auto mb-4"></div>
                <p className="text-charcoal-600 dark:text-cream-400">Loading executive members...</p>
              </div>
            ) : executiveMembers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-mustard-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-chocolate-700 dark:text-white mb-2">
                  No Executive Members Found
                </h3>
                <p className="text-charcoal-600 dark:text-cream-400 mb-6">
                  Executive members with roles (president, vice_president, secretary, etc.) will appear here.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {executiveMembers.map((member, index) => (
                <div 
                  key={index}
                    className={`group relative backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-chocolate-700/30 transition-all duration-500 hover:scale-105 hover:shadow-3xl transition-all duration-700 ease-out ${loading ? 'opacity-100' : 'opacity-0 transform translate-y-8 scale-95'}`}
                    style={{ transitionDelay: loading ? '0ms' : `${300 + (index * 100)}ms` }}
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-mustard-500/10 via-orange-500/5 to-chocolate-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 p-6 md:p-8">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-mustard-500/30 shadow-lg group-hover:border-mustard-500/60 transition-all duration-300">
                        <img 
                            src={member.profilePicture}
                            alt={member.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-chocolate-700 dark:text-white mb-1 group-hover:text-mustard-600 dark:group-hover:text-mustard-400 transition-colors">
                          {member.fullName}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-mustard-500 to-orange-500 text-white font-semibold rounded-full text-xs md:text-sm mb-2 shadow-md">
                          {formatRoleName(member.role)}
                      </div>
                      <p className="text-charcoal-600 dark:text-cream-400 text-xs md:text-sm mb-0.5">
                        {member.faculty}
                      </p>
                      <p className="text-charcoal-500 dark:text-cream-500 text-xs">
                        {member.year}
                      </p>
                    </div>

                    {/* Contact Info */}
                      <div className="space-y-2 relative z-20">
                      <div className="flex items-center justify-center space-x-3 text-sm">
                          <a
                            href={`mailto:${member.email}`}
                            className="w-8 h-8 bg-mustard-500/20 rounded-full flex items-center justify-center hover:bg-mustard-500/40 transition-colors cursor-pointer"
                          >
                          <span className="text-mustard-600 dark:text-mustard-400">📧</span>
                          </a>
                        <a 
                          href={`mailto:${member.email}`}
                          className="text-charcoal-600 dark:text-cream-400 hover:text-mustard-600 dark:hover:text-mustard-400 transition-colors"
                        >
                          {member.email}
                        </a>
                      </div>
                        {/* member.phone && (
                      <div className="flex items-center justify-center space-x-3 text-sm">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 dark:text-orange-400">📱</span>
                        </div>
                        <a 
                          href={`tel:${member.phone}`}
                          className="text-charcoal-600 dark:text-cream-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                        ) */}
                        {member.linkedin && (
                          <div className="flex items-center justify-center space-x-3 text-sm">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/40 transition-colors cursor-pointer"
                            >
                              <span className="text-blue-600 dark:text-blue-400">💼</span>
                            </a>
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-charcoal-600 dark:text-cream-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                    </div>

                    {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-mustard-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                    </div>
                </div>
              ))}
            </div>
            )}

            {/* Call to Action */}
            <div className="text-center mt-16 md:mt-20">
              <div className="max-w-2xl mx-auto backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-chocolate-700/30 p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-chocolate-700 dark:text-white mb-4">
                  Want to Join Our Team?
                </h2>
                <p className="text-charcoal-600 dark:text-cream-400 mb-8 text-lg">
                  We're always looking for passionate individuals to help lead our community. 
                  Contact us to learn about upcoming opportunities!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/join-us"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-mustard-500 to-orange-500 hover:from-mustard-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 hover:shadow-xl text-lg shadow-lg"
                  >
                    <span className="mr-2">🚀</span>
                    Join Our Club
                  </a>
                  <a 
                    href="mailto:vibecornernibm.info@gmail.com"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-chocolate-600 to-chocolate-700 hover:from-chocolate-700 hover:to-chocolate-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 hover:shadow-xl text-lg shadow-lg"
                  >
                    <span className="mr-2">📧</span>
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};