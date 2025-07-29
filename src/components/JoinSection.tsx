import React, { useState, createElement, useEffect, useRef } from 'react';
import { CheckIcon } from 'lucide-react';
import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/firebase';
import { isDisposableEmail, isDisposableEmailDomain } from 'disposable-email-domains-js';
import { sendClubApplicationEmail } from '../services/emailService';

export const JoinSection = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        studentIndexId: '',
        faculty: '',
        year: '',
        interests: [] as string[],
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [studentIdExists, setStudentIdExists] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        studentIndexId: '',
        faculty: '',
        year: '',
        interests: ''
    });
    const sectionRef = useRef<HTMLElement>(null);

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
                    const formContainer = element.querySelector('.max-w-5xl') as HTMLElement;
                    
                    if (titleSection) {
                        setTimeout(() => {
                            titleSection.style.opacity = '1';
                            titleSection.style.transform = 'translateY(0)';
                        }, 200);
                    }
                    
                    if (formContainer) {
                        setTimeout(() => {
                            formContainer.style.opacity = '1';
                            formContainer.style.transform = 'translateY(0) scale(1)';
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

    // Add email validation function
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // WhatsApp data state
    const [whatsappData, setWhatsappData] = useState({
        alt_contact1: '',
        alt_contact_message1: ''
    });

    // Fetch WhatsApp data from Firebase
    useEffect(() => {
        const fetchWhatsappData = async () => {
            try {
                const whatsappRef = ref(database, 'whatsapp/alt_whatsapp');
                const snapshot = await get(whatsappRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setWhatsappData({
                        alt_contact1: data.alt_contact1 || '',
                        alt_contact_message1: data.alt_contact_message1 || ''
                    });
                }
            } catch (err) {
                // console.error('Error fetching WhatsApp data:', err);
            }
        };

        fetchWhatsappData();
    }, []);

    // Add new error state for each field
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Special handling for studentIndexId field
        if (name === 'studentIndexId') {
            // Convert to uppercase and only allow letters, numbers, spaces, dots, and dashes
            const filteredValue = value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');
            setFormState(prev => ({
                ...prev,
                [name]: filteredValue
            }));
        } else {
            setFormState(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear field error when user starts typing/selecting
        setFieldErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        // Check if email already exists when email field changes
        if (name === 'email' && value) {
            checkEmailExists(value);
        } else if (name === 'email' && !value) {
            setEmailExists(false);
        }

        // Check if student ID already exists when studentIndexId field changes
        if (name === 'studentIndexId' && value) {
            checkStudentIdExists(value);
        } else if (name === 'studentIndexId' && !value) {
            setStudentIdExists(false);
        }
    };

    const checkEmailExists = async (email: string) => {
        try {
            // Normalize email (lowercase and trim)
            const normalizedEmail = email.toLowerCase().trim();

            const applicationsRef = ref(database, 'applications');
            const snapshot = await get(applicationsRef);

            if (snapshot.exists()) {
                const applications = snapshot.val();
                const emailExists = Object.values(applications).some((app: any) =>
                    app.email && app.email.toLowerCase().trim() === normalizedEmail
                );
                setEmailExists(emailExists);
            } else {
                setEmailExists(false);
            }
        } catch (err) {
            // console.error('Error checking email:', err);
            setEmailExists(false);
        }
    };

    const checkStudentIdExists = async (studentId: string) => {
        try {
            // Normalize student ID (uppercase and trim)
            const normalizedStudentId = studentId.toUpperCase().trim();

            const applicationsRef = ref(database, 'applications');
            const snapshot = await get(applicationsRef);

            if (snapshot.exists()) {
                const applications = snapshot.val();
                const studentIdExists = Object.values(applications).some((app: any) =>
                    app.studentIndexId && app.studentIndexId.toUpperCase().trim() === normalizedStudentId
                );
                setStudentIdExists(studentIdExists);
            } else {
                setStudentIdExists(false);
            }
        } catch (err) {
            // console.error('Error checking student ID:', err);
            setStudentIdExists(false);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormState(prev => {
            if (checked) {
                return {
                    ...prev,
                    interests: [...prev.interests, value]
                };
            } else {
                return {
                    ...prev,
                    interests: prev.interests.filter(interest => interest !== value)
                };
            }
        });

        // Clear interests error when user selects/deselects
        setFieldErrors(prev => ({
            ...prev,
            interests: ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let errors = { name: '', email: '', studentIndexId: '', faculty: '', year: '', interests: '' };
        let hasError = false;
        if (!formState.name.trim()) {
            errors.name = 'Please enter your full name.';
            hasError = true;
        }
        if (!formState.email.trim()) {
            errors.email = 'Please enter your email address.';
            hasError = true;
        } else if (!validateEmail(formState.email)) {
            errors.email = 'Please enter a valid email address.';
            hasError = true;
        } else if (isDisposableEmail(formState.email) || isDisposableEmailDomain(formState.email)) {
            errors.email = 'Temporary/disposable email addresses are not allowed.';
            hasError = true;
        } else if (emailExists) {
            errors.email = 'This email has already been used for an application.';
            hasError = true;
        }
        if (!formState.studentIndexId.trim()) {
            errors.studentIndexId = 'Please enter your NIBM student ID.';
            hasError = true;
        } else if (studentIdExists) {
            errors.studentIndexId = 'This student index id has already been used for an application.';
            hasError = true;
        }
        if (!formState.faculty) {
            errors.faculty = 'Please select your faculty of study.';
            hasError = true;
        }
        if (!formState.year) {
            errors.year = 'Please select your year of study.';
            hasError = true;
        }
        if (formState.interests.length === 0) {
            errors.interests = 'Please select at least one interest.';
            hasError = true;
        }
        setFieldErrors(errors);
        if (hasError) return;

        setIsSubmitting(true);

        try {
            // Create a reference to the 'applications' node in the database
            const applicationsRef = ref(database, 'applications');

            // Prepare the data with timestamp
            const applicationData = {
                ...formState,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            // Push the data to Firebase Realtime Database
            const newApplicationRef = push(applicationsRef);
            await set(newApplicationRef, applicationData);
            // console.log('Application submitted successfully:', applicationData);

            // Send confirmation email
            let isEmailSend = false;
            try {
                const emailSent = await sendClubApplicationEmail(applicationData);
                if (emailSent) {
                    isEmailSend = true;
                    // console.log('Confirmation email sent successfully');
                } else {
                    // console.warn('Failed to send confirmation email');
                }
            } catch (error) {
                // console.error('Error sending confirmation email:', error);
            }

            // Update the application with isEmailSend status
            await set(newApplicationRef, {
                ...applicationData,
                isEmailSend,
            });

            setIsSubmitted(true);
            createConfetti();

            // Reset form after successful submission (10 seconds)
            setTimeout(() => {
                setIsSubmitted(false);
                setFormState({
                    name: '',
                    email: '',
                    studentIndexId: '',
                    faculty: '',
                    year: '',
                    interests: [],
                    message: ''
                });
                setEmailExists(false);
                setStudentIdExists(false);
            }, 100000);

        } catch (err) {
            // console.error('Error submitting application:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

  const createConfetti = () => {
    let confettiCount;
    if (window.innerWidth <= 768) {
      confettiCount = 200; // Mobile
    } else if (window.innerWidth <= 1024) {
      confettiCount = 300; // Tablet
    } else {
      confettiCount = 500; // Desktop
    }
    const container = document.getElementById('confetti-container');
    if (!container) return;
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      // Random color - chocolate, mustard, sand, orange
      const colors = ['#5C4033', '#F4C430', '#C19A6B', '#FFB347', '#FFFFFF'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;
      confetti.style.position = 'absolute';
      confetti.style.left = `${Math.random() * window.innerWidth}px`;
      confetti.style.top = `${Math.random() * window.innerHeight * 0.3}px`;
      // Random size
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      // Random rotation
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      // Random shape - square or circle
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.opacity = '0.85';
      confetti.style.pointerEvents = 'none';
      // Staggered delay: up to 2s
      const delay = Math.random() * 2000;
      setTimeout(() => {
        confetti.animate([
          { transform: confetti.style.transform, opacity: 1 },
          { transform: `translateY(${window.innerHeight * 0.8}px) ${confetti.style.transform}`, opacity: 0.3 }
        ], {
          duration: 4000, // 4 seconds
          easing: 'ease-out',
          fill: 'forwards'
        });
        container.appendChild(confetti);
        setTimeout(() => {
          if (container.contains(confetti)) container.removeChild(confetti);
        }, 4000);
      }, delay);
    }
  };

    return (
        <section id="join" ref={sectionRef} className="py-12 md:py-20 px-4 bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20 relative overflow-hidden opacity-0 transform translate-y-8 transition-all duration-1000 ease-out">
            {/* Enhanced decorative elements */}
            <div className="absolute top-10 left-5 w-40 h-40 md:w-80 md:h-80 rounded-full bg-chocolate-700/10 blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-5 w-60 h-60 md:w-96 md:h-96 rounded-full bg-mustard-500/10 blur-3xl animate-float-delay"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-orange-500/5 blur-2xl animate-float-slow"></div>

            <div className="container mx-auto relative z-10 max-w-6xl">
                <div className="text-center mb-8 md:mb-12 opacity-0 transform translate-y-8 transition-all duration-1000 ease-out delay-200">
                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-chocolate-700 to-mustard-600 bg-clip-text text-transparent">
                        Join Our Club
                    </h2>
                    <p className="text-lg md:text-xl text-charcoal-600 dark:text-cream-400 max-w-3xl mx-auto leading-relaxed">
                        Become part of our vibrant community and discover a space where you can
                        express yourself, relieve stress, and make lasting friendships.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-chocolate-700/30 opacity-0 transform translate-y-8 scale-95 transition-all duration-1000 ease-out delay-300">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Left side - Benefits */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-chocolate-700 via-saddle-700 to-chocolate-800 text-white p-8 md:p-10 relative overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(244,196,48,0.3),transparent_50%)]"></div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                                    <span className="mr-3 text-3xl">🌟</span>
                                    Why Join Us?
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex items-start group">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-mustard-500/30 flex items-center justify-center mr-4 group-hover:bg-mustard-500/50 transition-colors">
                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <span className="font-medium text-base md:text-lg group-hover:text-mustard-300 transition-colors">
                                            Express yourself through art and performance
                                        </span>
                                    </li>
                                    <li className="flex items-start group">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/30 flex items-center justify-center mr-4 group-hover:bg-orange-500/50 transition-colors">
                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <span className="font-medium text-base md:text-lg group-hover:text-orange-300 transition-colors">
                                            Learn stress management techniques
                                        </span>
                                    </li>
                                    <li className="flex items-start group">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-mustard-500/30 flex items-center justify-center mr-4 group-hover:bg-mustard-500/50 transition-colors">
                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <span className="font-medium text-base md:text-lg group-hover:text-mustard-300 transition-colors">
                                            Make friends who share your interests
                                        </span>
                                    </li>
                                    <li className="flex items-start group">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/30 flex items-center justify-center mr-4 group-hover:bg-orange-500/50 transition-colors">
                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <span className="font-medium text-base md:text-lg group-hover:text-orange-300 transition-colors">
                                            Participate in fun, creative events
                                        </span>
                                    </li>
                                    <li className="flex items-start group">
                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-mustard-500/30 flex items-center justify-center mr-4 group-hover:bg-mustard-500/50 transition-colors">
                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <span className="font-medium text-base md:text-lg group-hover:text-mustard-300 transition-colors">
                                            Create a balanced university experience
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right side - Form */}
                        <div className="lg:col-span-3 p-6 md:p-8">
                            {isSubmitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-chocolate-700/20 rounded-full flex items-center justify-center mb-4 md:mb-6 animate-pulse-glow">
                                        <CheckIcon className="w-8 h-8 md:w-10 md:h-10 text-chocolate-700 dark:text-mustard-500" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-chocolate-700 dark:text-white mb-3 md:mb-4">
                                        Thank You!
                                    </h3>
                                    <p className="text-charcoal-500 dark:text-cream-500 text-base md:text-lg max-w-md mb-6">
                                        Your application has been submitted successfully! We're excited to
                                        welcome you to our community.
                                    </p>

                                    <div className="bg-gradient-to-br from-cream-50 to-cream-100 dark:from-saddle-900/40 dark:to-saddle-800/30 rounded-2xl p-6 md:p-8 max-w-md border-2 border-cream-200/80 dark:border-saddle-700/60 shadow-lg backdrop-blur-sm">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                                                <span className="text-white text-lg">📋</span>
                                            </div>
                                            <h4 className="font-bold text-lg text-chocolate-700 dark:text-mustard-400">
                                                Application Received
                                            </h4>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-sm text-charcoal-700 dark:text-cream-300 leading-relaxed">
                                                Your application has been successfully submitted! We'll review your details and contact you soon with next steps.
                                            </p>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                                    ⏰ We'll contact you within 24-48 hours with further instructions.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <a
                                                href={`https://wa.me/${whatsappData.alt_contact1}?text=${encodeURIComponent(whatsappData.alt_contact_message1)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg text-sm shadow-md"
                                            >
                                                <span className="mr-2 text-lg">📱</span>
                                                Chat on WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    {/* For name field: */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                        placeholder-charcoal-400 dark:placeholder-cream-600
                                                        text-charcoal-800 dark:text-white

                                                        focus:outline-none
                                                        focus:ring-0
                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                        />
                                        {fieldErrors.name && (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>{fieldErrors.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="email" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formState.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                        placeholder-charcoal-400 dark:placeholder-cream-600
                                                        text-charcoal-800 dark:text-white

                                                        focus:outline-none
                                                        focus:ring-0
                                                        focus:border-yellow-500 dark:focus:border-yellow-400 ${emailExists
                                                    ? 'border-red-500 dark:border-red-400 focus:border-red-500'
                                                    : ''
                                                }`}
                                            placeholder="Enter your email address"
                                        />
                                        {fieldErrors.email ? (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>{fieldErrors.email}</span>
                                            </div>
                                        ) : emailExists ? (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>This email has already been used for an application.</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="studentIndexId" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                            Student Index ID
                                        </label>
                                        <input
                                            type="text"
                                            id="studentIndexId"
                                            name="studentIndexId"
                                            value={formState.studentIndexId}
                                            onChange={handleChange}
                                            placeholder="Enter your NIBM student ID (e.g : MADSE241F-001)"
                                            pattern="[A-Z0-9\s-]+"
                                            title="Only capital letters, numbers, spaces, dots, and dashes are allowed"
                                            className={`w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                        placeholder-charcoal-400 dark:placeholder-cream-600
                                                        text-charcoal-800 dark:text-white

                                                        focus:outline-none
                                                        focus:ring-0
                                                        focus:border-yellow-500 dark:focus:border-yellow-400 ${studentIdExists
                                                    ? 'border-red-500 dark:border-red-400 focus:border-red-500'
                                                    : ''
                                                }`}
                                        />
                                        {fieldErrors.studentIndexId ? (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>{fieldErrors.studentIndexId}</span>
                                            </div>
                                        ) : studentIdExists ? (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>This student index id has already been used for an application.</span>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="faculty" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                            Faculty
                                        </label>
                                        <select
                                            id="faculty"
                                            name="faculty"
                                            value={formState.faculty}
                                            onChange={handleChange}
                                            className="appearance-none w-full px-4 pr-8 py-2 rounded-xl text-base transition-all duration-300
                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                        placeholder-charcoal-400 dark:placeholder-cream-600
                                                        text-charcoal-800 dark:text-white

                                                        focus:outline-none
                                                        focus:ring-0
                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                        >
                                            <option value="">Select Faculty of Study</option>
                                            <option value="School of Business">School of Business</option>
                                            <option value="School of Computing">School of Computing</option>
                                            <option value="School of Engineering">School of Engineering</option>
                                            <option value="School of Language">School of Language</option>
                                            <option value="School of Design">School of Design</option>
                                            <option value="School of Humanities">School of Humanities</option>
                                            <option value="Business Analytics Center">Business Analytics Center</option>
                                            <option value="Productivity & Quality Center">Productivity & Quality Center</option>
                                        </select>
                                        {fieldErrors.faculty && (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>{fieldErrors.faculty}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="year" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                            Year of Study
                                        </label>
                                        <select
                                            id="year"
                                            name="year"
                                            value={formState.year}
                                            onChange={handleChange}
                                            className="appearance-none w-full px-4 pr-8 py-2 rounded-xl text-base transition-all duration-300
                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                        placeholder-charcoal-400 dark:placeholder-cream-600
                                                        text-charcoal-800 dark:text-white

                                                        focus:outline-none
                                                        focus:ring-0
                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                        >
                                            <option value="">Select Year of Study</option>
                                            <option value="First Year">First Year</option>
                                            <option value="Second Year">Second Year</option>
                                            <option value="Third Year">Third Year</option>
                                            <option value="Fourth Year">Fourth Year</option>
                                            <option value="Certificate Programme">Certificate Programme</option>
                                            <option value="Foundation Programme">Foundation Programme</option>
                                        </select>
                                        {fieldErrors.year && (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>{fieldErrors.year}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                            Interests (select at least one)
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <label className="flex items-center px-5 py-2 bg-white/80 dark:bg-charcoal-800/80 rounded-xl border-2 border-chocolate-400 dark:border-saddle-600 focus-within:border-yellow-500 dark:focus-within:border-yellow-400 focus-within:ring-0 transition-all duration-300 cursor-pointer group shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    name="interests"
                                                    value="music"
                                                    checked={formState.interests.includes('music')}
                                                    onChange={handleCheckboxChange}
                                                    className="rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400 mr-3 w-5 h-5"
                                                />
                                                <span className="text-charcoal-700 dark:text-cream-300 group-hover:text-mustard-600 dark:group-hover:text-mustard-400 transition-colors text-base font-medium">
                                                    Music 🎵
                                                </span>
                                            </label>
                                            <label className="flex items-center px-5 py-2 bg-white/80 dark:bg-charcoal-800/80 rounded-xl border-2 border-chocolate-400 dark:border-saddle-600 focus-within:border-yellow-500 dark:focus-within:border-yellow-400 focus-within:ring-0 transition-all duration-300 cursor-pointer group shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    name="interests"
                                                    value="drama"
                                                    checked={formState.interests.includes('drama')}
                                                    onChange={handleCheckboxChange}
                                                    className="rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400 mr-3 w-5 h-5"
                                                />
                                                <span className="text-charcoal-700 dark:text-cream-300 group-hover:text-mustard-600 dark:group-hover:text-mustard-400 transition-colors text-base font-medium">
                                                    Drama 🎭
                                                </span>
                                            </label>
                                            <label className="flex items-center px-5 py-2 bg-white/80 dark:bg-charcoal-800/80 rounded-xl border-2 border-chocolate-400 dark:border-saddle-600 focus-within:border-yellow-500 dark:focus-within:border-yellow-400 focus-within:ring-0 transition-all duration-300 cursor-pointer group shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    name="interests"
                                                    value="meditation"
                                                    checked={formState.interests.includes('meditation')}
                                                    onChange={handleCheckboxChange}
                                                    className="rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400 mr-3 w-5 h-5"
                                                />
                                                <span className="text-charcoal-700 dark:text-cream-300 group-hover:text-mustard-600 dark:group-hover:text-mustard-400 transition-colors text-base font-medium">
                                                    Meditation 🧘
                                                </span>
                                            </label>
                                            <label className="flex items-center px-5 py-2 bg-white/80 dark:bg-charcoal-800/80 rounded-xl border-2 border-chocolate-400 dark:border-saddle-600 focus-within:border-yellow-500 dark:focus-within:border-yellow-400 focus-within:ring-0 transition-all duration-300 cursor-pointer group shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    name="interests"
                                                    value="art"
                                                    checked={formState.interests.includes('art')}
                                                    onChange={handleCheckboxChange}
                                                    className="rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400 mr-3 w-5 h-5"
                                                />
                                                <span className="text-charcoal-700 dark:text-cream-300 group-hover:text-mustard-600 dark:group-hover:text-mustard-400 transition-colors text-base font-medium">
                                                    Art 🎨
                                                </span>
                                            </label>
                                        </div>
                                        {fieldErrors.interests && (
                                            <div className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm">
                                                <span>{fieldErrors.interests}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="message" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                            Why do you want to join? (Optional)
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formState.message}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                        placeholder-charcoal-400 dark:placeholder-cream-600
                                                        text-charcoal-800 dark:text-white
                                                        focus:outline-none
                                                        focus:ring-0
                                                        focus:border-yellow-500 dark:focus:border-yellow-400
                                                        resize-none"
                                            placeholder="Tell us a bit about yourself and why you'd like to join our club..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-mustard-500 to-orange-500 hover:from-mustard-600 hover:to-orange-600 disabled:from-mustard-400 disabled:to-orange-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl text-lg flex items-center justify-center shadow-lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                <span>Submitting Application...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">🚀</span>
                                                Submit Application
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}; 