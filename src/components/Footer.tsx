import React from 'react';
import { InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const contactInfo = {
    contact_number: '0703476767',
    email: 'vibecornernibm.info@gmail.com',
    address1: '2nd Floor, No. 26, NSB Building,',
    address2: 'අනගාරික ධර්මපාල මාවත, Matara'
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      href: '',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      href: '',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      href: '',
      color: 'hover:text-blue-600'
    },
    {
      name: 'YouTube',
      icon: YoutubeIcon,
      href: '',
      color: 'hover:text-red-500'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Join Us', href: '#join' }
  ];

  return (
    <footer className="bg-gradient-to-b from-chocolate-700 to-chocolate-800 dark:from-saddle-900 dark:to-saddle-950 text-white pt-8 md:pt-12 pb-4 md:pb-6 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Logo Section */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="text-mustard-500 bg-gradient-to-r from-mustard-400 to-orange-500 bg-clip-text text-transparent">
                Vibe
              </span>
              <span className="text-white">Corner</span>
            </h2>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-white flex items-center justify-center md:justify-start">
              <span className="w-6 h-0.5 bg-mustard-500 mr-3 hidden md:block"></span>
              About Us
            </h3>
            <p className="text-white/80 mb-3 text-sm md:text-base leading-relaxed">
              A student club dedicated to promoting mental freedom and stress
              relief through creative expression. We believe in the power of
              art, music, and community to heal and inspire.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-mustard-500/20 text-mustard-300 text-xs rounded-full border border-mustard-500/30">
                Creative Expression
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                Mental Wellness
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                Art Therapy
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                Community
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                Music & Dance
              </span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                Stress Relief
              </span>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2 text-white/80 text-sm md:text-base">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href.slice(1))}
                    className="hover:text-mustard-500 transition-all duration-300 hover:translate-x-1 inline-block group"
                  >
                    <span className="group-hover:underline decoration-mustard-500 underline-offset-4">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Section */}
          <div className="text-center md:text-right">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-white">Contact Us</h3>
            <div className="space-y-3 text-white/80 text-sm md:text-base">
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <MapPin className="w-4 h-4 text-mustard-500 flex-shrink-0" />
                <div className="space-y-0">
                  <p>{contactInfo.address1}</p>
                  <p>{contactInfo.address2}</p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <Mail className="w-4 h-4 text-mustard-500 flex-shrink-0" />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-mustard-500 transition-colors hover:underline"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <Phone className="w-4 h-4 text-mustard-500 flex-shrink-0" />
                <a 
                  href={`tel:${contactInfo.contact_number}`}
                  className="hover:text-mustard-500 transition-colors hover:underline"
                >
                  {contactInfo.contact_number}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media Section */}
        <div className="flex justify-center space-x-6 mb-6 md:mb-8">
          {socialLinks.map((social) => (
            <a 
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-white/70 ${social.color} transition-all duration-300 transform hover:scale-110 hover:rotate-3 p-2 rounded-full hover:bg-white/10`}
              aria-label={`Follow us on ${social.name}`}
            >
              <social.icon className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          ))}
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-white/20 pt-3 md:pt-4 text-center">
          <div className="text-white/60 text-xs md:text-sm space-y-1">
            <p>© {currentYear} Stellixor Technologies. All rights reserved.</p>
            <p className="flex items-center justify-center space-x-2">
              <span>NIBM VibeCorner Club Management System</span>
              <span className="text-mustard-500">✨</span>
              <span>NIBM</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};