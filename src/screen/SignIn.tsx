import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from 'lucide-react';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/firebase';
import Toast from '../ui/Toast';

export const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    }>({
        show: false,
        type: 'info',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear any existing toast when user starts typing
        if (toast.show) {
            setToast(prev => ({ ...prev, show: false }));
        }
    };

    const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
        setToast({ show: true, type, message });
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            showToast('error', 'Please enter your email address');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showToast('error', 'Please enter a valid email address');
            return false;
        }

        if (!formData.password) {
            showToast('error', 'Please enter your password');
            return false;
        }

        if (formData.password.length < 6) {
            showToast('error', 'Password must be at least 6 characters');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Check if user exists in Firebase
            const usersRef = ref(database, 'users');
            const userQuery = query(usersRef, orderByChild('email'), equalTo(formData.email.toLowerCase()));
            const snapshot = await get(userQuery);

            if (!snapshot.exists()) {
                showToast('error', 'No account found with this email address');
                setIsLoading(false);
                return;
            }

            // Get user data
            const userData = Object.values(snapshot.val())[0] as any;

            // Check password (in real app, this should be hashed)
            if (userData.password !== formData.password) {
                showToast('error', 'Incorrect password. Please try again');
                setIsLoading(false);
                return;
            }

            // Success - store user data in localStorage or context
            localStorage.setItem('user', JSON.stringify({
                id: Object.keys(snapshot.val())[0],
                ...userData
            }));

            showToast('success', 'Welcome back! Sign in successful');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);

        } catch (error) {
            console.error('Sign in error:', error);
            showToast('error', 'An error occurred. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20 flex items-center justify-center px-4">
            {/* Background decorative elements */}
            <div className="absolute top-10 left-5 w-40 h-40 md:w-80 md:h-80 rounded-full bg-chocolate-700/10 blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-5 w-60 h-60 md:w-96 md:h-96 rounded-full bg-mustard-500/10 blur-3xl animate-float-delay"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-mustard-500 to-mustard-600 bg-clip-text text-transparent font-serif">Libe</span>
                        <span className="text-chocolate-700">rate</span>
                    </h1>
                    <h2 className="text-2xl font-bold text-charcoal-700 dark:text-white mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-charcoal-600 dark:text-cream-400">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Sign In Form */}
                <div className="backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-chocolate-700/30 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-lg">📧</span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-base transition-all duration-300
                    bg-white/80 dark:bg-charcoal-800/80
                    border-2 border-chocolate-400 dark:border-saddle-600
                    placeholder-charcoal-400 dark:placeholder-cream-600
                    text-charcoal-800 dark:text-white
                    focus:outline-none focus:ring-0
                    focus:border-yellow-500 dark:focus:border-yellow-400"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white text-lg">🔒</span>
                        <input
                            type={showPassword ? 'text' : 'password'} // This changes input type based on showPassword state
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-12 py-3 rounded-xl text-base transition-all duration-300
                    bg-white/80 dark:bg-charcoal-800/80 
                    border-2 border-chocolate-400 dark:border-saddle-600
                    placeholder-charcoal-400 dark:placeholder-cream-600
                    text-charcoal-800 dark:text-white
                    focus:outline-none focus:ring-0
                    focus:border-yellow-500 dark:focus:border-yellow-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-cream-500 hover:text-charcoal-600 dark:hover:text-cream-300 transition-colors"
                        >
                            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400 mr-2"
                                />
                                <span className="text-sm text-charcoal-600 dark:text-cream-400">Remember me</span>
                            </label>
                            <a
                                href="#"
                                className="text-sm text-mustard-600 dark:text-mustard-400 hover:text-mustard-700 dark:hover:text-mustard-300 transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-mustard-500 to-orange-500 hover:from-mustard-600 hover:to-orange-600 
                        disabled:from-mustard-400 disabled:to-orange-400 disabled:cursor-not-allowed 
                        text-white font-bold py-4 rounded-xl transition-all duration-300 
                        transform hover:scale-[1.02] hover:shadow-xl text-lg flex items-center justify-center shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">🔐</span>
                                    Sign In
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
                                    Don't have an account?
                                </span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <a
                            href="/signup"
                            className="w-full bg-gradient-to-r from-chocolate-600 to-saddle-700 hover:from-chocolate-700 hover:to-saddle-800 
                        text-white font-bold py-4 rounded-xl transition-all duration-300 
                        transform hover:scale-[1.02] hover:shadow-xl text-lg flex items-center justify-center shadow-lg"
                        >
                            <span className="mr-2">✨</span>
                            Create Account
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