import React from 'react';
import { InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-chocolate-700 dark:bg-saddle-900 text-white pt-12 md:pt-16 pb-6 md:pb-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-mustard-500">Libe</span>rate
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white">About Us</h3>
            <p className="text-white/80 mb-3 md:mb-4 text-sm md:text-base">
              A student club dedicated to promoting mental freedom and stress
              relief through creative expression.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2 text-white/80 text-sm md:text-base">
              <li>
                <a href="#home" className="hover:text-mustard-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-mustard-500 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-mustard-500 transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-mustard-500 transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#join" className="hover:text-mustard-500 transition-colors">
                  Join Us
                </a>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white">Contact Us</h3>
            <address className="not-italic text-white/80 space-y-1 md:space-y-2 text-sm md:text-base">
              <p>Student Union Building, Room 204</p>
              <p>University Campus</p>
              <p>
                Email:{' '}
                <a href="mailto:info@liberate.edu" className="hover:text-orange-500 transition-colors">
                  info@liberate.edu
                </a>
              </p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 md:space-x-6 mb-6 md:mb-8">
          <a 
            href="#" 
            className="text-white/70 hover:text-orange-500 transition-colors transform hover:scale-110" 
            aria-label="Instagram"
          >
            <InstagramIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a 
            href="#" 
            className="text-white/70 hover:text-orange-500 transition-colors transform hover:scale-110" 
            aria-label="Twitter"
          >
            <TwitterIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a 
            href="#" 
            className="text-white/70 hover:text-mustard-500 transition-colors transform hover:scale-110" 
            aria-label="Facebook"
          >
            <FacebookIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <a 
            href="#" 
            className="text-white/70 hover:text-mustard-500 transition-colors transform hover:scale-110" 
            aria-label="YouTube"
          >
            <YoutubeIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>
        </div>
        
        <div className="border-t border-white/20 pt-6 md:pt-8 text-center text-white/60 text-xs md:text-sm">
          <p>
            © 2025 Stellixor Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};