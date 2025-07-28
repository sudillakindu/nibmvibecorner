import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebase';

export const WhatsAppButton = () => {
  const [whatsappLink, setWhatsappLink] = useState(''); // Default fallback

  // Fetch WhatsApp community link from Firebase
  useEffect(() => {
    const fetchWhatsappLink = async () => {
      try {
        const whatsappRef = ref(database, 'whatsapp/community_whatsapp');
        const snapshot = await get(whatsappRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.whatsapp_community) {
            setWhatsappLink(data.whatsapp_community);
          }
        }
      } catch (error) {
        console.error('Error fetching WhatsApp community link:', error);
        // Continue with default link if Firebase fails
      }
    };

    fetchWhatsappLink();
  }, []);

  const handleClick = () => {
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 backdrop-blur-md shadow-lg rounded-full p-3 md:p-4 transition-all transform hover:scale-110 border bg-green-500 border-green-600 hover:bg-green-600"
      aria-label="Join our WhatsApp community"
      title="Join our WhatsApp community"
    >
      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 6.318h-.001a9.87 9.87 0 01-4.988-1.357l-.357-.213-3.711.982.993-3.617-.232-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.987c-.003 5.45-4.437 9.884-9.883 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.336.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.86 11.86 0 005.735 1.463h.005c6.554 0 11.889-5.336 11.892-11.892a11.82 11.82 0 00-3.473-8.413z"/>
      </svg>
    </button>
  );
};
