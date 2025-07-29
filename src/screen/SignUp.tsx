import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, UserIcon, PhoneIcon } from 'lucide-react';
import { ref, get, push, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/firebase';
import { sendSignupApplicationEmail } from '../services/emailService';
import Toast from '../ui/Toast';

export const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        studentIndexId: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        year: '',
        faculty: '',
        linkedin: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [toast, setToast] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    }>({
        show: false,
        type: 'info',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Special handling for studentIndexId field
        if (name === 'studentIndexId') {
            // Convert to uppercase and only allow letters, numbers, spaces, and dashes
            const filteredValue = value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: filteredValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Clear any existing toast when user starts typing
        if (toast.show) {
            setToast(prev => ({ ...prev, show: false }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreeToTerms(e.target.checked);
        // Clear any existing toast when user changes checkbox
        if (toast.show) {
            setToast(prev => ({ ...prev, show: false }));
        }
    };

    const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
        setToast({ show: true, type, message });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        if (!formData.studentIndexId.trim()) {
            newErrors.studentIndexId = 'Please enter your NIBM student ID';
        } else if (formData.studentIndexId.trim().length < 3) {
            newErrors.studentIndexId = 'Student ID must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.faculty) {
            newErrors.faculty = 'Please select your faculty of study';
        }

        if (!formData.year) {
            newErrors.year = 'Please select your year of study';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeToTerms) {
            newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Show first error in toast
            const firstError = Object.values(newErrors)[0];
            showToast('error', firstError);
            return false;
        }

        return true;
    };

    const getClientIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            // console.error('Error fetching IP:', error);
            return 'unknown';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Check if email already exists
            const usersRef = ref(database, 'users');
            const emailQuery = query(usersRef, orderByChild('email'), equalTo(formData.email.toLowerCase()));
            const emailSnapshot = await get(emailQuery);

            if (emailSnapshot.exists()) {
                showToast('error', 'An account with this email already exists');
                setIsLoading(false);
                return;
            }

            // Check if student ID already exists
            const studentIdQuery = query(usersRef, orderByChild('studentIndexId'), equalTo(formData.studentIndexId));
            const studentIdSnapshot = await get(studentIdQuery);

            if (studentIdSnapshot.exists()) {
                showToast('error', 'An account with this Student ID already exists');
                setIsLoading(false);
                return;
            }

            // Check if mobile number already exists
            const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(formData.phone.trim()));
            const phoneSnapshot = await get(phoneQuery);

            if (phoneSnapshot.exists()) {
                showToast('error', 'An account with this mobile number already exists');
                setIsLoading(false);
                return;
            }

            // Get client IP address
            const clientIP = await getClientIP();
            const currentTime = new Date().toISOString();

            // Create new user with all required fields
            const newUser = {
                fullName: formData.fullName.trim(),
                studentIndexId: formData.studentIndexId.trim(),
                email: formData.email.toLowerCase().trim(),
                phone: formData.phone.trim(),
                password: formData.password, // In real app, this should be hashed
                faculty: formData.faculty,
                year: formData.year,
                linkedin: formData.linkedin.trim(),
                lastLogin: currentTime,
                lastLoginIp: clientIP,
                isEmailVerified: false,
                profilePicture: '', // Default empty string for profile picture
                role: 'member', // Default role for new users
                status: 'pending', // Default status
                createdAt: currentTime
            };

            // Add user to Firebase
            const newUserRef = await push(usersRef, newUser);

            if (newUserRef.key) {
                // Send confirmation email
                try {
                    const emailData = {
                        fullName: formData.fullName.trim(),
                        email: formData.email.toLowerCase().trim(),
                        studentIndexId: formData.studentIndexId.trim(),
                        phone: formData.phone.trim(),
                        faculty: formData.faculty,
                        year: formData.year,
                        linkedin: formData.linkedin.trim(),
                        role: newUser.role,
                        status: newUser.status,
                        lastLogin: newUser.lastLogin,
                        lastLoginIp: newUser.lastLoginIp,
                        isEmailVerified: newUser.isEmailVerified,
                        profilePicture: newUser.profilePicture
                    };
                    
                    const emailSent = await sendSignupApplicationEmail(emailData);
                    
                    if (emailSent) {
                        showToast('success', 'Account created successfully! Welcome to NIBM VibeCorner Club! Check your email for confirmation.');
                    } else {
                        showToast('success', 'Account created successfully! Welcome to NIBM VibeCorner Club! (Email notification failed)');
                    }
                } catch (emailError) {
                    // console.error('Error sending confirmation email:', emailError);
                    showToast('success', 'Account created successfully! Welcome to NIBM VibeCorner Club! (Email notification failed)');
                }

                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    id: newUserRef.key,
                    ...newUser
                }));

                // Redirect to home page after a short delay
                // setTimeout(() => {
                //     window.location.href = '/';
                // }, 3000);
            } else {
                throw new Error('Failed to create user');
            }

        } catch (error) {
            // console.error('Sign up error:', error);
            showToast('error', 'An error occurred while creating your account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20 flex items-center justify-center px-4 py-8">
            {/* Background decorative elements */}
            <div className="absolute top-10 left-5 w-40 h-40 md:w-80 md:h-80 rounded-full bg-chocolate-700/10 blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-5 w-60 h-60 md:w-96 md:h-96 rounded-full bg-mustard-500/10 blur-3xl animate-float-delay"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-mustard-500 to-mustard-600 bg-clip-text text-transparent font-serif">Vibe</span>
                        <span className="text-chocolate-700">Corner</span>
                    </h1>
                    <h2 className="text-2xl font-bold text-charcoal-700 dark:text-white mb-2">
                        Create Account
                    </h2>
                    <p className="text-charcoal-600 dark:text-cream-400">
                        Join our community and start your journey
                    </p>
                </div>

                {/* Sign Up Form */}
                <div className="backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-chocolate-700/30 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Full Name Field */}
                        <div className="space-y-1">
                            <label htmlFor="fullName" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">👤</span>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.fullName ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            placeholder-charcoal-400 dark:placeholder-cream-600
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-red-500 text-xs">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Student Index ID Field */}
                        <div className="space-y-1">
                            <label htmlFor="studentIndexId" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Student Index ID
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">🆔</span>
                                <input
                                    type="text"
                                    id="studentIndexId"
                                    name="studentIndexId"
                                    value={formData.studentIndexId}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your NIBM student ID"
                                    pattern="[A-Z0-9\s-]+"
                                    title="Only capital letters, numbers, spaces, and dashes are allowed"
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.studentIndexId ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            placeholder-charcoal-400 dark:placeholder-cream-600
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                />
                            </div>
                            {errors.studentIndexId && (
                                <p className="text-red-500 text-xs">{errors.studentIndexId}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">📧</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.email ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            placeholder-charcoal-400 dark:placeholder-cream-600
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Phone Number
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">📞</span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your phone number"
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.phone ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            placeholder-charcoal-400 dark:placeholder-cream-600
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-xs">{errors.phone}</p>
                            )}
                        </div>

                        {/* Faculty Field */}
                        <div className="space-y-1">
                            <label htmlFor="faculty" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Faculty
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">🎓</span>
                                <select
                                    id="faculty"
                                    name="faculty"
                                    value={formData.faculty}
                                    onChange={handleChange}
                                    required
                                    className={`appearance-none w-full pl-10 pr-4 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.faculty ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
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
                            </div>
                            {errors.faculty && (
                                <p className="text-red-500 text-xs">{errors.faculty}</p>
                            )}
                        </div>

                        {/* Year Field */}
                        <div className="space-y-1">
                            <label htmlFor="year" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Year of Study
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">📅</span>
                                <select
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    className={`appearance-none w-full pl-10 pr-4 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.year ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                >
                                    <option value="">Select Year of Study</option>
                                    <option value="First Year">First Year</option>
                                    <option value="Second Year">Second Year</option>
                                    <option value="Third Year">Third Year</option>
                                    <option value="Fourth Year">Fourth Year</option>
                                    <option value="Certificate Programme">Certificate Programme</option>
                                    <option value="Foundation Programme">Foundation Programme</option>
                                </select>
                            </div>
                            {errors.year && (
                                <p className="text-red-500 text-xs">{errors.year}</p>
                            )}
                        </div>

                        {/* LinkedIn Field */}
                        <div className="space-y-1">
                            <label htmlFor="linkedin" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                LinkedIn Profile (Optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">💼</span>
                                <input
                                    type="url"
                                    id="linkedin"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="Enter your LinkedIn profile URL"
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.linkedin ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            placeholder-charcoal-400 dark:placeholder-cream-600
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                />
                            </div>
                            {errors.linkedin && (
                                <p className="text-red-500 text-xs">{errors.linkedin}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a password"
                                    className={`w-full pl-10 pr-12 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.password ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            placeholder-charcoal-400 dark:placeholder-cream-600
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-cream-500 hover:text-charcoal-600 dark:hover:text-cream-300 transition-colors"
                                >
                                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-base">🔒</span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
                                    className={`w-full pl-10 pr-12 py-2 rounded-xl text-base font-normal transition-all duration-300
                            bg-white/80 dark:bg-charcoal-800/80
                            border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-chocolate-400 dark:border-saddle-600'}
                            placeholder-charcoal-400 dark:placeholder-cream-600
                            text-charcoal-800 dark:text-white
                            focus:outline-none focus:ring-0
                            focus:border-yellow-500 dark:focus:border-yellow-400`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-cream-500 hover:text-charcoal-600 dark:hover:text-cream-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-2">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                checked={agreeToTerms}
                                onChange={handleCheckboxChange}
                                className="mt-1 rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400"
                            />
                            <label htmlFor="agreeToTerms" className="text-sm text-charcoal-600 dark:text-cream-400">
                                I agree to the{' '}
                                <a href="#" className="text-mustard-600 dark:text-mustard-400 hover:text-mustard-700 dark:hover:text-mustard-300">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-mustard-600 dark:text-mustard-400 hover:text-mustard-700 dark:hover:text-mustard-300">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-red-500 text-xs">{errors.terms}</p>
                        )}

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-mustard-500 to-orange-500 hover:from-mustard-600 hover:to-orange-600 
                        disabled:from-mustard-400 disabled:to-orange-400 disabled:cursor-not-allowed 
                        text-white font-bold py-4 rounded-xl transition-all duration-300 
                        transform hover:scale-[1.02] hover:shadow-xl text-lg flex items-center justify-center shadow-lg mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">✨</span>
                                    Create Account
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-charcoal-300 dark:border-charcoal-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white/80 dark:bg-charcoal-900/80 text-charcoal-500 dark:text-cream-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <a
                            href="/signin"
                            className="w-full bg-gradient-to-r from-chocolate-600 to-saddle-700 hover:from-chocolate-700 hover:to-saddle-800 
                        text-white font-bold py-4 rounded-xl transition-all duration-300 
                        transform hover:scale-[1.02] hover:shadow-xl text-lg flex items-center justify-center shadow-lg"
                        >
                            <span className="mr-2">🔐</span>
                            Sign In
                        </a>
                    </form>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-charcoal-600 dark:text-cream-400 hover:text-mustard-600 dark:hover:text-mustard-400 transition-colors"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                type={toast.type}
                message={toast.message}
                isVisible={toast.show}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
                duration={4000}
            />
        </div>
    );
}; 