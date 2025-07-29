import React, { useState, useEffect } from 'react';
import { Search, Headphones, TrendingUp, Building2, FileText, Grid3X3, Settings, MapPin, Bell, BarChart3, User, ArrowUp, ArrowDown, Music, Calendar, Award, UserCheck, Image, Crown, ArrowLeft, Plus, MicIcon, Palette, Heart, Users, CheckIcon, FileText as FileTextIcon, Mail, Phone, MapPin as MapPinIcon, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { ref, push, get, onValue, set } from 'firebase/database';
import { database } from '../firebase/firebase';
import { uploadImageToImgBB, validateImageFile } from '../services/imageUploadService';

interface EventFormData {
    eventId: string;
    eventName: string;
    eventType: string;
    organizedBy: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    venue: string;
    description: string;
    imageUrl: string;
    registrationRequired: boolean;
    registrationDeadline: string;
    maxParticipants: number;
    contactPerson: string;
    status: string;
    isActive: boolean;
    createdAt: string;
}

interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    studentIndexId: string;
    year: string;
    faculty: string;
    profilePicture?: string;
    linkedin?: string;
    createdAt: string;
    lastLogin: string;
    isEmailVerified: boolean;
}

interface Application {
    id: string;
    name: string;
    email: string;
    studentIndexId: string;
    faculty: string;
    year: string;
    interests: string[];
    message?: string;
    status: string;
    timestamp: string;
    isEmailSend: boolean;
}

const eventTypes = [
    { value: 'music', label: 'Music', icon: Music, emoji: '🎵' },
    { value: 'competition', label: 'Competition', icon: Users, emoji: '🏆' },
    { value: 'hackathon', label: 'Hackathon', icon: Users, emoji: '💻' },
    { value: 'debate', label: 'Debate', icon: Users, emoji: '🗣️' },
    { value: 'exhibition', label: 'Exhibition', icon: Users, emoji: '🖼️' },
    { value: 'theater', label: 'Theater', icon: Users, emoji: '🎭' },
    { value: 'sports', label: 'Sports', icon: Users, emoji: '⚽' },
    { value: 'workshop', label: 'Workshop', icon: Users, emoji: '🔧' },
    { value: 'art', label: 'Art', icon: Palette, emoji: '🎨' },
    { value: 'drama', label: 'Drama', icon: Users, emoji: '🎭' },
    { value: 'meditation', label: 'Meditation', icon: Heart, emoji: '🧘' },
    { value: 'open-mic', label: 'Open Mic', icon: MicIcon, emoji: '🎤' },
    { value: 'other', label: 'Other', icon: Users, emoji: '📋' }
];

const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'postponed', label: 'Postponed' },
    { value: 'upcoming', label: 'Upcoming' }
];

const Dashboard: React.FC = () => {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [isVisible, setIsVisible] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState('2024');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<User | Application | null>(null);
    const [modalType, setModalType] = useState<'user' | 'application'>('user');
    const [editFormData, setEditFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [formData, setFormData] = useState<EventFormData>({
        eventId: '',
        eventName: '',
        eventType: 'workshop',
        organizedBy: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        description: '',
        imageUrl: '',
        registrationRequired: false,
        registrationDeadline: '',
        maxParticipants: 0,
        contactPerson: '',
        status: 'upcoming',
        isActive: false,
        createdAt: ''
    });

    // Check authorization on component mount
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            window.location.href = '/signin';
            return;
        }

        const userData = JSON.parse(user);
        const userRole = userData.role?.toLowerCase();
        const adminRoles = ['president', 'student_coordinator', 'social_media_manager'];
        
        if (!adminRoles.includes(userRole)) {
            window.location.href = '/';
            return;
        }

        setCurrentUser(userData);
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    useEffect(() => {
        setIsVisible(true);
        fetchUsers();
        fetchApplications();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const usersRef = ref(database, 'users');
            const snapshot = await get(usersRef);
            
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const usersArray: User[] = Object.keys(usersData).map(key => ({
                    id: key,
                    ...usersData[key]
                }));
                setUsers(usersArray);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchApplications = async () => {
        setLoadingApplications(true);
        try {
            const applicationsRef = ref(database, 'applications');
            const snapshot = await get(applicationsRef);
            
            if (snapshot.exists()) {
                const applicationsData = snapshot.val();
                const applicationsArray: Application[] = Object.keys(applicationsData).map(key => ({
                    id: key,
                    ...applicationsData[key]
                }));
                setApplications(applicationsArray);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoadingApplications(false);
        }
    };

    // Filter users based on role
    const generalMembers = users.filter(user => user.role === 'member');
    const executiveMembers = users.filter(user => user.role !== 'member' && user.role !== undefined);

    // Filter data based on search term
    const filteredGeneralMembers = generalMembers.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.studentIndexId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredExecutiveMembers = executiveMembers.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.studentIndexId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApplications = applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentIndexId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const eventsRef = ref(database, 'events');
            const eventId = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Prepare data with conditional fields
            const eventData = {
                ...formData,
                eventId,
                createdAt: new Date().toISOString(),
                // Set default values when not required
                registrationDeadline: formData.registrationRequired ? formData.registrationDeadline : '',
                maxParticipants: formData.registrationRequired ? formData.maxParticipants : 0
            };

            await push(eventsRef, eventData);

            // Show success message
            alert('Event added successfully!');
            // Reset form
            setFormData({
                eventId: '',
                eventName: '',
                eventType: 'workshop',
                organizedBy: '',
                eventDate: '',
                startTime: '',
                endTime: '',
                venue: '',
                description: '',
                imageUrl: '',
                registrationRequired: false,
                registrationDeadline: '',
                maxParticipants: 0,
                contactPerson: '',
                status: 'upcoming',
                isActive: false,
                createdAt: ''
            });
        } catch (error) {
            // console.error('Error adding event:', error);
            alert('Error adding event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Updated Navigation with your specific requirements
    const mainNavItems = [
        { id: 'dashboard', icon: Grid3X3, label: 'Dashboard', count: 0 },
        { id: 'executive', icon: Crown, label: 'Executive Member', count: executiveMembers.length },
        { id: 'general', icon: UserCheck, label: 'General Member', count: generalMembers.length },
        { id: 'application', icon: FileTextIcon, label: 'Application', count: applications.length },
        { id: 'event', icon: Calendar, label: 'Event', count: 15 },
        { id: 'gallery', icon: Image, label: 'Gallery', count: 23 },
        { id: 'settings', icon: Settings, label: 'Settings', count: 3 },
    ];

    const summaryCards = [
        {
            title: 'Total Members',
            subtitle: 'Active Members',
            value: users.length.toString(),
            usage: `${Math.round((users.filter(u => u.status === 'active').length / users.length) * 100) || 0}%`,
            remaining: `${Math.round((users.filter(u => u.status !== 'active').length / users.length) * 100) || 0}%`,
            icon: UserCheck,
            color: 'chocolate',
            progress: Math.round((users.filter(u => u.status === 'active').length / users.length) * 100) || 0,
            change: `+${generalMembers.length}`,
            trend: 'up',
            details: {
                newThisMonth: generalMembers.length,
                activeToday: users.filter(u => u.status === 'active').length,
                totalRegistrations: users.length
            }
        },
        {
            title: 'Executive Members',
            subtitle: 'Club Leadership',
            value: executiveMembers.length.toString(),
            usage: `${Math.round((executiveMembers.filter(u => u.status === 'active').length / executiveMembers.length) * 100) || 0}%`,
            remaining: `${Math.round((executiveMembers.filter(u => u.status !== 'active').length / executiveMembers.length) * 100) || 0}%`,
            icon: Crown,
            color: 'chocolate',
            progress: Math.round((executiveMembers.filter(u => u.status === 'active').length / executiveMembers.length) * 100) || 0,
            change: `+${executiveMembers.length}`,
            trend: 'up',
            details: {
                upcoming: executiveMembers.length,
                ongoing: executiveMembers.filter(u => u.status === 'active').length,
                completed: executiveMembers.length
            }
        },
        {
            title: 'Applications',
            subtitle: 'Pending Review',
            value: applications.length.toString(),
            usage: `${Math.round((applications.filter(a => a.status === 'pending').length / applications.length) * 100) || 0}%`,
            remaining: `${Math.round((applications.filter(a => a.status !== 'pending').length / applications.length) * 100) || 0}%`,
            icon: FileTextIcon,
            color: 'chocolate',
            progress: Math.round((applications.filter(a => a.status === 'pending').length / applications.length) * 100) || 0,
            change: `+${applications.filter(a => a.status === 'pending').length}`,
            trend: 'up',
            details: {
                thisWeek: applications.filter(a => new Date(a.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
                thisMonth: applications.filter(a => new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
                totalSessions: applications.length
            }
        }
    ];

    const activityData = [
        { month: 'August', value: '156', trend: 'up', newMembers: 23, events: 4 },
        { month: 'September', value: '189', trend: 'up', newMembers: 34, events: 6 },
        { month: 'October', value: '145', trend: 'down', newMembers: 18, events: 3 }
    ];

    const recentMembers = users
        .sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
        .slice(0, 5)
        .map(user => ({
            id: user.id,
            name: user.fullName,
            faculty: user.faculty,
            year: user.year,
            status: user.status,
            avatar: user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        }));

    const upcomingEvents: any[] = [];

    const recentActivities = [
        ...applications.slice(0, 3).map(app => ({
            id: app.id,
            title: `New application from ${app.name}`,
            description: `Applied for ${app.interests.join(', ')}`,
            timestamp: new Date(app.timestamp).toLocaleDateString(),
            icon: FileTextIcon,
            color: 'mustard'
        })),
        ...users.slice(0, 2).map(user => ({
            id: user.id,
            title: `${user.fullName} joined the club`,
            description: `${user.role} - ${user.faculty}`,
            timestamp: new Date(user.createdAt).toLocaleDateString(),
            icon: UserCheck,
            color: 'chocolate'
        }))
    ];

    // View and Edit functions
    const handleView = (item: User | Application, type: 'user' | 'application') => {
        setSelectedItem(item);
        setModalType(type);
        setShowViewModal(true);
    };

    const handleEdit = (item: User | Application, type: 'user' | 'application') => {
        setSelectedItem(item);
        setModalType(type);
        setEditFormData({ ...item });
        
        // Set image preview if editing a user with profile picture
        if (type === 'user' && (item as User).profilePicture) {
            setImagePreview((item as User).profilePicture || null);
        } else {
            setImagePreview(null);
        }
        
        setProfileImage(null);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedItem) return;
        
        setSaving(true);
        try {
            const path = modalType === 'user' ? 'users' : 'applications';
            const itemRef = ref(database, `${path}/${selectedItem.id}`);
            
            let updatedData = { ...editFormData };
            
            // Handle profile image upload for users
            if (modalType === 'user' && profileImage) {
                try {
                    // Upload image to ImgBB with user's name
                    const userName = editFormData.fullName || (selectedItem as User).fullName;
                    const imageUrl = await uploadImageToImgBB(profileImage, userName);
                    updatedData.profilePicture = imageUrl;
                    
                    // Update the item in Firebase
                    await set(itemRef, updatedData);
                    
                    // Update local state
                    setUsers((prev: User[]) => prev.map(user => 
                        user.id === selectedItem.id ? { ...user, ...updatedData } : user
                    ));
                    
                    setShowEditModal(false);
                    setSelectedItem(null);
                    setEditFormData({});
                    setProfileImage(null);
                    setImagePreview(null);
                } catch (error) {
                    console.error('Error uploading image:', error);
                    alert('Failed to upload image. Please try again.');
                    return;
                }
                return;
            }
            
            // Update the item in Firebase
            await set(itemRef, updatedData);
            
            // Update local state
            if (modalType === 'user') {
                setUsers((prev: User[]) => prev.map(user => 
                    user.id === selectedItem.id ? { ...user, ...updatedData } : user
                ));
            } else {
                setApplications((prev: Application[]) => prev.map(app => 
                    app.id === selectedItem.id ? { ...app, ...updatedData } : app
                ));
            }
            
            setShowEditModal(false);
            setSelectedItem(null);
            setEditFormData({});
            setProfileImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setEditFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const closeModals = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
        setEditFormData({});
        setProfileImage(null);
        setImagePreview(null);
    };

    // Profile image handling functions
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file using the service
            const validation = validateImageFile(file);
            if (!validation.isValid) {
                alert(validation.error);
                return;
            }
            
            setProfileImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImage(null);
        setImagePreview(null);
        // Clear the file input
        const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Show loading while checking authorization
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sand-50 to-chocolate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mustard-500 mx-auto mb-4"></div>
                    <p className="text-chocolate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sand-50 to-chocolate-50">
            <div className="flex">
                {/* Sidebar - Updated to match image exactly */}
                <div className="w-64 h-screen bg-chocolate-800 flex flex-col items-center py-6 space-y-8 fixed left-0 top-0">
                    {/* Logo - Using the provided image */}
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-[100px] h-[100px] rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                                src="/image/sx.png"
                                alt="NIBM Club Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* User Info and Logout */}
                    {currentUser && (
                        <div className="flex flex-col items-center space-y-4 w-full px-4">
                            <div className="text-center">
                                <p className="text-white text-sm font-medium">{currentUser.fullName}</p>
                                <p className="text-cream-300 text-xs capitalize">{currentUser.role?.replace('_', ' ')}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    )}

                    {/* Navigation - Updated with your specific menu items */}
                    <nav className="flex flex-col space-y-6 w-full px-4">
                        {mainNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveNav(item.id);
                                        setSearchTerm(''); // Clear search when switching tabs
                                    }}
                                    className={`relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeNav === item.id
                                            ? 'bg-mustard-500 text-white shadow-lg'
                                            : 'text-white hover:bg-mustard-500/20 hover:text-mustard-300'
                                        }`}
                                    title={item.label}
                                >
                                    <Icon className="w-7 h-7" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="ml-64 flex-1 p-8">
                    {/* Conditional rendering based on active navigation */}
                    {activeNav === 'event' ? (
                        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-saddle-900/30 dark:via-charcoal-900 dark:to-saddle-900/20 relative overflow-hidden">
                            {/* Enhanced decorative elements */}
                            <div className="absolute top-10 left-5 w-40 h-40 md:w-80 md:h-80 rounded-full bg-chocolate-700/10 blur-3xl animate-float"></div>
                            <div className="absolute bottom-10 right-5 w-60 h-60 md:w-96 md:h-96 rounded-full bg-mustard-500/10 blur-3xl animate-float-delay"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-orange-500/5 blur-2xl animate-float-slow"></div>

                            <div className="container mx-auto relative z-10 max-w-6xl">
                                <div className="text-center mb-8 md:mb-12">
                                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-chocolate-700 to-mustard-600 bg-clip-text text-transparent">
                                        Create New Event
                                    </h2>
                                    <p className="text-lg md:text-xl text-charcoal-600 dark:text-cream-400 max-w-3xl mx-auto leading-relaxed">
                                        Organize exciting events that bring our community together. Create memorable experiences 
                                        through music, drama, art, and more.
                                    </p>
                                </div>

                                <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/80 dark:bg-charcoal-900/80 rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-chocolate-700/30">
                                    <div className="grid grid-cols-1 lg:grid-cols-5">
                                        {/* Left side - Event Benefits */}
                                        <div className="lg:col-span-2 bg-gradient-to-br from-chocolate-700 via-saddle-700 to-chocolate-800 text-white p-8 md:p-10 relative overflow-hidden">
                                            {/* Background pattern */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(244,196,48,0.3),transparent_50%)]"></div>
                                            </div>

                                            <div className="relative z-10">
                                                <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
                                                    <span className="mr-3 text-3xl">🎉</span>
                                                    Event Benefits
                                                </h3>
                                                <ul className="space-y-6">
                                                    <li className="flex items-start group">
                                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-mustard-500/30 flex items-center justify-center mr-4 group-hover:bg-mustard-500/50 transition-colors">
                                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                                        </div>
                                                        <span className="font-medium text-base md:text-lg group-hover:text-mustard-300 transition-colors">
                                                            Connect with fellow students
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start group">
                                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/30 flex items-center justify-center mr-4 group-hover:bg-orange-500/50 transition-colors">
                                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                                        </div>
                                                        <span className="font-medium text-base md:text-lg group-hover:text-orange-300 transition-colors">
                                                            Showcase your talents
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start group">
                                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-mustard-500/30 flex items-center justify-center mr-4 group-hover:bg-mustard-500/50 transition-colors">
                                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                                        </div>
                                                        <span className="font-medium text-base md:text-lg group-hover:text-mustard-300 transition-colors">
                                                            Build leadership skills
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start group">
                                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500/30 flex items-center justify-center mr-4 group-hover:bg-orange-500/50 transition-colors">
                                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                                        </div>
                                                        <span className="font-medium text-base md:text-lg group-hover:text-orange-300 transition-colors">
                                                            Create lasting memories
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start group">
                                                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-mustard-500/30 flex items-center justify-center mr-4 group-hover:bg-mustard-500/50 transition-colors">
                                                            <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
                                                        </div>
                                                        <span className="font-medium text-base md:text-lg group-hover:text-mustard-300 transition-colors">
                                                            Enhance university experience
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Right side - Event Form */}
                                        <div className="lg:col-span-3 p-6 md:p-8">
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                {/* Event Name */}
                                                <div className="space-y-1">
                                                    <label htmlFor="eventName" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        Event Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="eventName"
                                                        name="eventName"
                                                        value={formData.eventName}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Enter event name"
                                                        className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                    bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                    border-2 border-chocolate-400 dark:border-saddle-600
                                                                    placeholder-charcoal-400 dark:placeholder-cream-600
                                                                    text-charcoal-800 dark:text-white
                                                                    focus:outline-none focus:ring-0
                                                                    focus:border-yellow-500 dark:focus:border-yellow-400"
                                                    />
                                                </div>

                                                {/* Organized By */}
                                                <div className="space-y-1">
                                                    <label htmlFor="organizedBy" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        Organized By *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="organizedBy"
                                                        name="organizedBy"
                                                        value={formData.organizedBy}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Enter organizer name"
                                                        className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                    bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                    border-2 border-chocolate-400 dark:border-saddle-600
                                                                    placeholder-charcoal-400 dark:placeholder-cream-600
                                                                    text-charcoal-800 dark:text-white
                                                                    focus:outline-none focus:ring-0
                                                                    focus:border-yellow-500 dark:focus:border-yellow-400"
                                                    />
                                                </div>

                                                {/* Description */}
                                                <div className="space-y-1">
                                                    <label htmlFor="description" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        Description *
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        required
                                                        rows={3}
                                                        placeholder="Describe your event..."
                                                        className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                    bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                    border-2 border-chocolate-400 dark:border-saddle-600
                                                                    placeholder-charcoal-400 dark:placeholder-cream-600
                                                                    text-charcoal-800 dark:text-white
                                                                    focus:outline-none focus:ring-0
                                                                    focus:border-yellow-500 dark:focus:border-yellow-400
                                                                    resize-none"
                                                    />
                                                </div>

                                                {/* Event Type */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        Event Type *
                                                    </label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {eventTypes.map((type) => (
                                                            <label
                                                                key={type.value}
                                                                className={`relative cursor-pointer p-3 bg-white/80 dark:bg-charcoal-800/80 rounded-xl border-2 border-chocolate-400 dark:border-saddle-600 focus-within:border-yellow-500 dark:focus-within:border-yellow-400 focus-within:ring-0 transition-all duration-300 group shadow-sm ${formData.eventType === type.value
                                                                    ? 'border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                                                                    : 'hover:border-yellow-400 dark:hover:border-yellow-500'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="eventType"
                                                                    value={type.value}
                                                                    checked={formData.eventType === type.value}
                                                                    onChange={handleInputChange}
                                                                    className="sr-only"
                                                                />
                                                                <div className="text-center">
                                                                    <span className="text-xl mb-1 block">{type.emoji}</span>
                                                                    <span className="text-xs font-medium text-charcoal-700 dark:text-cream-300 group-hover:text-mustard-600 dark:group-hover:text-mustard-400 transition-colors">
                                                                        {type.label}
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Date and Time */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div className="space-y-1">
                                                        <label htmlFor="eventDate" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                            Event Date *
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="eventDate"
                                                            name="eventDate"
                                                            value={formData.eventDate}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                                        text-charcoal-800 dark:text-white
                                                                        focus:outline-none focus:ring-0
                                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label htmlFor="startTime" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                            Start Time *
                                                        </label>
                                                        <input
                                                            type="time"
                                                            id="startTime"
                                                            name="startTime"
                                                            value={formData.startTime}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                                        text-charcoal-800 dark:text-white
                                                                        focus:outline-none focus:ring-0
                                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label htmlFor="endTime" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                            End Time *
                                                        </label>
                                                        <input
                                                            type="time"
                                                            id="endTime"
                                                            name="endTime"
                                                            value={formData.endTime}
                                                            onChange={handleInputChange}
                                                            required
                                                            className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                                        text-charcoal-800 dark:text-white
                                                                        focus:outline-none focus:ring-0
                                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Venue */}
                                                <div className="space-y-1">
                                                    <label htmlFor="venue" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        Venue *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="venue"
                                                        name="venue"
                                                        value={formData.venue}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Enter venue location"
                                                        className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                    bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                    border-2 border-chocolate-400 dark:border-saddle-600
                                                                    placeholder-charcoal-400 dark:placeholder-cream-600
                                                                    text-charcoal-800 dark:text-white
                                                                    focus:outline-none focus:ring-0
                                                                    focus:border-yellow-500 dark:focus:border-yellow-400"
                                                    />
                                                </div>

                                                {/* Contact Person */}
                                                <div className="space-y-1">
                                                    <label htmlFor="contactPerson" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        Contact Person *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="contactPerson"
                                                        name="contactPerson"
                                                        value={formData.contactPerson}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Enter contact person name"
                                                        className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                    bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                    border-2 border-chocolate-400 dark:border-saddle-600
                                                                    placeholder-charcoal-400 dark:placeholder-cream-600
                                                                    text-charcoal-800 dark:text-white
                                                                    focus:outline-none focus:ring-0
                                                                    focus:border-yellow-500 dark:focus:border-yellow-400"
                                                    />
                                                </div>

                                                {/* Status */}
                                                <div className="space-y-1">
                                                    <label htmlFor="status" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        Status *
                                                    </label>
                                                    <select
                                                        id="status"
                                                        name="status"
                                                        value={formData.status}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="appearance-none w-full px-4 pr-8 py-2 rounded-xl text-base transition-all duration-300
                                                                    bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                    border-2 border-chocolate-400 dark:border-saddle-600
                                                                    text-charcoal-800 dark:text-white
                                                                    focus:outline-none focus:ring-0
                                                                    focus:border-yellow-500 dark:focus:border-yellow-400"
                                                    >
                                                        {statusOptions.map((status) => (
                                                            <option key={status.value} value={status.value}>
                                                                {status.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Registration Required */}
                                                <div className="space-y-1">
                                                    <label className="flex items-center text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        <input
                                                            type="checkbox"
                                                            name="registrationRequired"
                                                            checked={formData.registrationRequired}
                                                            onChange={handleInputChange}
                                                            className="rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400 mr-3 w-5 h-5"
                                                        />
                                                        Registration Required
                                                    </label>
                                                </div>

                                                {/* Registration Deadline - Only show if registration is required */}
                                                {formData.registrationRequired && (
                                                    <div className="space-y-1">
                                                        <label htmlFor="registrationDeadline" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                            Registration Deadline *
                                                        </label>
                                                        <input
                                                            type="datetime-local"
                                                            id="registrationDeadline"
                                                            name="registrationDeadline"
                                                            value={formData.registrationDeadline}
                                                            onChange={handleInputChange}
                                                            required={formData.registrationRequired}
                                                            className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                                        text-charcoal-800 dark:text-white
                                                                        focus:outline-none focus:ring-0
                                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                                        />
                                                    </div>
                                                )}

                                                {/* Max Participants - Only show if registration is required */}
                                                {formData.registrationRequired && (
                                                    <div className="space-y-1">
                                                        <label htmlFor="maxParticipants" className="block text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                            Maximum Participants *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="maxParticipants"
                                                            name="maxParticipants"
                                                            value={formData.maxParticipants}
                                                            onChange={handleInputChange}
                                                            required={formData.registrationRequired}
                                                            min="1"
                                                            placeholder="Enter maximum number of participants"
                                                            className="w-full px-4 py-2 rounded-xl text-base transition-all duration-300
                                                                        bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-sm
                                                                        border-2 border-chocolate-400 dark:border-saddle-600
                                                                        placeholder-charcoal-400 dark:placeholder-cream-600
                                                                        text-charcoal-800 dark:text-white
                                                                        focus:outline-none focus:ring-0
                                                                        focus:border-yellow-500 dark:focus:border-yellow-400"
                                                        />
                                                    </div>
                                                )}

                                                {/* Is Active */}
                                                <div className="space-y-1">
                                                    <label className="flex items-center text-sm font-semibold text-charcoal-700 dark:text-cream-300 mb-0.5">
                                                        <input
                                                            type="checkbox"
                                                            name="isActive"
                                                            checked={formData.isActive}
                                                            onChange={handleInputChange}
                                                            className="rounded text-mustard-600 focus:ring-yellow-500 dark:focus:ring-yellow-400 mr-3 w-5 h-5"
                                                        />
                                                        Event is Active
                                                    </label>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-mustard-500 to-orange-500 hover:from-mustard-600 hover:to-orange-600 disabled:from-mustard-400 disabled:to-orange-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl text-lg flex items-center justify-center shadow-lg"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                            <span>Creating Event...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="mr-2">🎉</span>
                                                            Create Event
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : activeNav === 'executive' ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gradient-mustard">Executive Members</h1>
                                    <p className="text-chocolate-600 mt-1">Manage executive members of the NIBM Club</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="relative p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                                    </button>
                                    <button className="p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <BarChart3 className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-chocolate-700">Olga Tomarashvill</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200 mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chocolate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search executive members..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mustard-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={fetchUsers}
                                        className="px-4 py-2 bg-mustard-500 text-white rounded-xl hover:bg-mustard-600 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* Executive Members List */}
                            <div className="bg-white rounded-2xl shadow-lg border border-cream-200">
                                <div className="p-6 border-b border-cream-200">
                                    <h2 className="text-xl font-semibold text-chocolate-700">Executive Members ({filteredExecutiveMembers.length})</h2>
                                </div>
                                {loadingUsers ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mustard-500 mx-auto"></div>
                                        <p className="text-chocolate-600 mt-2">Loading executive members...</p>
                                    </div>
                                ) : filteredExecutiveMembers.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <User className="w-12 h-12 text-chocolate-400 mx-auto mb-4" />
                                        <p className="text-chocolate-600">No executive members found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-cream-200">
                                        {filteredExecutiveMembers.map((user) => (
                                            <div key={user.id} className="p-6 hover:bg-cream-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                                            <img 
                                                                src={user.profilePicture || '/image/profile.png'} 
                                                                alt={user.fullName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                    const nextElement = target.nextElementSibling as HTMLElement;
                                                                    if (nextElement) {
                                                                        nextElement.classList.remove('hidden');
                                                                    }
                                                                }}
                                                            />
                                                            <span className="hidden">
                                                                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-chocolate-700">{user.fullName}</h3>
                                                            <p className="text-sm text-chocolate-500">{user.role}</p>
                                                            <div className="flex items-center space-x-4 mt-1">
                                                                <span className="flex items-center text-xs text-chocolate-400">
                                                                    <Mail className="w-3 h-3 mr-1" />
                                                                    {user.email}
                                                                </span>
                                                                <span className="flex items-center text-xs text-chocolate-400">
                                                                    <FileTextIcon className="w-3 h-3 mr-1" />
                                                                    {user.studentIndexId}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            user.status === 'active' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {user.status}
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            <button 
                                                                onClick={() => handleView(user, 'user')}
                                                                className="p-2 text-chocolate-400 hover:text-mustard-600 transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleEdit(user, 'user')}
                                                                className="p-2 text-chocolate-400 hover:text-mustard-600 transition-colors"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-chocolate-500">Faculty:</span>
                                                        <p className="text-chocolate-700">{user.faculty}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Year:</span>
                                                        <p className="text-chocolate-700">{user.year}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Phone:</span>
                                                        <p className="text-chocolate-700">{user.phone}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Last Login:</span>
                                                        <p className="text-chocolate-700">{new Date(user.lastLogin).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : activeNav === 'general' ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gradient-mustard">General Members</h1>
                                    <p className="text-chocolate-600 mt-1">View and manage general members of the NIBM Club</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="relative p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                                    </button>
                                    <button className="p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <BarChart3 className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-chocolate-700">Olga Tomarashvill</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200 mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chocolate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search general members..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mustard-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={fetchUsers}
                                        className="px-4 py-2 bg-mustard-500 text-white rounded-xl hover:bg-mustard-600 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* General Members List */}
                            <div className="bg-white rounded-2xl shadow-lg border border-cream-200">
                                <div className="p-6 border-b border-cream-200">
                                    <h2 className="text-xl font-semibold text-chocolate-700">General Members ({filteredGeneralMembers.length})</h2>
                                </div>
                                {loadingUsers ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mustard-500 mx-auto"></div>
                                        <p className="text-chocolate-600 mt-2">Loading general members...</p>
                                    </div>
                                ) : filteredGeneralMembers.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <UserCheck className="w-12 h-12 text-chocolate-400 mx-auto mb-4" />
                                        <p className="text-chocolate-600">No general members found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-cream-200">
                                        {filteredGeneralMembers.map((user) => (
                                            <div key={user.id} className="p-6 hover:bg-cream-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                                            <img 
                                                                src={user.profilePicture || '/image/profile.png'} 
                                                                alt={user.fullName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                    const nextElement = target.nextElementSibling as HTMLElement;
                                                                    if (nextElement) {
                                                                        nextElement.classList.remove('hidden');
                                                                    }
                                                                }}
                                                            />
                                                            <span className="hidden">
                                                                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-chocolate-700">{user.fullName}</h3>
                                                            <p className="text-sm text-chocolate-500">General Member</p>
                                                            <div className="flex items-center space-x-4 mt-1">
                                                                <span className="flex items-center text-xs text-chocolate-400">
                                                                    <Mail className="w-3 h-3 mr-1" />
                                                                    {user.email}
                                                                </span>
                                                                <span className="flex items-center text-xs text-chocolate-400">
                                                                    <FileTextIcon className="w-3 h-3 mr-1" />
                                                                    {user.studentIndexId}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            user.status === 'active' 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {user.status}
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            <button 
                                                                onClick={() => handleView(user, 'user')}
                                                                className="p-2 text-chocolate-400 hover:text-mustard-600 transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleEdit(user, 'user')}
                                                                className="p-2 text-chocolate-400 hover:text-mustard-600 transition-colors"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-chocolate-500">Faculty:</span>
                                                        <p className="text-chocolate-700">{user.faculty}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Year:</span>
                                                        <p className="text-chocolate-700">{user.year}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Phone:</span>
                                                        <p className="text-chocolate-700">{user.phone}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Last Login:</span>
                                                        <p className="text-chocolate-700">{new Date(user.lastLogin).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : activeNav === 'application' ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gradient-mustard">Applications</h1>
                                    <p className="text-chocolate-600 mt-1">View and manage club applications</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="relative p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                                    </button>
                                    <button className="p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <BarChart3 className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-chocolate-700">Olga Tomarashvill</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200 mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chocolate-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search applications..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mustard-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={fetchApplications}
                                        className="px-4 py-2 bg-mustard-500 text-white rounded-xl hover:bg-mustard-600 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* Applications List */}
                            <div className="bg-white rounded-2xl shadow-lg border border-cream-200">
                                <div className="p-6 border-b border-cream-200">
                                    <h2 className="text-xl font-semibold text-chocolate-700">Applications ({filteredApplications.length})</h2>
                                </div>
                                {loadingApplications ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mustard-500 mx-auto"></div>
                                        <p className="text-chocolate-600 mt-2">Loading applications...</p>
                                    </div>
                                ) : filteredApplications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <FileTextIcon className="w-12 h-12 text-chocolate-400 mx-auto mb-4" />
                                        <p className="text-chocolate-600">No applications found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-cream-200">
                                        {filteredApplications.map((app) => (
                                            <div key={app.id} className="p-6 hover:bg-cream-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {app.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-chocolate-700">{app.name}</h3>
                                                            <p className="text-sm text-chocolate-500">Application</p>
                                                            <div className="flex items-center space-x-4 mt-1">
                                                                <span className="flex items-center text-xs text-chocolate-400">
                                                                    <Mail className="w-3 h-3 mr-1" />
                                                                    {app.email}
                                                                </span>
                                                                <span className="flex items-center text-xs text-chocolate-400">
                                                                    <FileTextIcon className="w-3 h-3 mr-1" />
                                                                    {app.studentIndexId}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            app.status === 'pending' 
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : app.status === 'approved'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {app.status}
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            <button 
                                                                onClick={() => handleView(app, 'application')}
                                                                className="p-2 text-chocolate-400 hover:text-mustard-600 transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleEdit(app, 'application')}
                                                                className="p-2 text-chocolate-400 hover:text-mustard-600 transition-colors"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-chocolate-500">Faculty:</span>
                                                        <p className="text-chocolate-700">{app.faculty}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Year:</span>
                                                        <p className="text-chocolate-700">{app.year}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Interests:</span>
                                                        <p className="text-chocolate-700">{app.interests.join(', ')}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-chocolate-500">Applied:</span>
                                                        <p className="text-chocolate-700">{new Date(app.timestamp).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {app.message && (
                                                    <div className="mt-3 p-3 bg-cream-50 rounded-lg">
                                                        <span className="text-chocolate-500 text-sm">Message:</span>
                                                        <p className="text-chocolate-700 text-sm mt-1">{app.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : activeNav === 'gallery' ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gradient-mustard">Gallery</h1>
                                    <p className="text-chocolate-600 mt-1">Browse and manage club event photos and media</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="relative p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                                    </button>
                                    <button className="p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <BarChart3 className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-chocolate-700">Olga Tomarashvill</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                                <h2 className="text-xl font-semibold text-chocolate-700 mb-4">Photo Gallery</h2>
                                <p className="text-chocolate-600">Gallery functionality will be implemented here.</p>
                            </div>
                        </>
                    ) : activeNav === 'settings' ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gradient-mustard">Settings</h1>
                                    <p className="text-chocolate-600 mt-1">Configure club settings and preferences</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="relative p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                                    </button>
                                    <button className="p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                        <BarChart3 className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                                        <div className="w-8 h-8 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-chocolate-700">Olga Tomarashvill</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                                <h2 className="text-xl font-semibold text-chocolate-700 mb-4">Club Settings</h2>
                                <p className="text-chocolate-600">Settings functionality will be implemented here.</p>
                            </div>
                        </>
                    ) : (
                        <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient-mustard">Dashboard</h1>
                            <p className="text-chocolate-600 mt-1">Welcome back, here's what's happening with your club</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                            </button>
                            <button className="p-2 text-chocolate-600 hover:text-mustard-600 transition-colors">
                                <BarChart3 className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                                <div className="w-8 h-8 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-chocolate-700">Olga Tomarashvill</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {summaryCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-chocolate-700">{card.title}</h3>
                                            <p className="text-sm text-chocolate-500">{card.subtitle}</p>
                                        </div>
                                        <div className="relative">
                                            <div className="w-16 h-12 rounded-full bg-chocolate-100 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-chocolate-600" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-chocolate-800 mb-2">{card.value}</div>
                                    <div className="flex items-center space-x-4 text-sm mb-3">
                                        <div className="flex items-center text-mustard-600">
                                            <ArrowUp className="w-4 h-4 mr-1" />
                                            {card.usage} Active
                                        </div>
                                        <div className="flex items-center text-orange-600">
                                            <ArrowDown className="w-4 h-4 mr-1" />
                                            {card.remaining} Pending
                                        </div>
                                    </div>
                                    <div className="text-xs text-chocolate-500">
                                        {card.change} from last month
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Statistics Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-chocolate-700">Member Statistics</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-mustard-500 rounded-full"></div>
                                        <span className="text-sm text-chocolate-600">New Members</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-chocolate-500 rounded-full"></div>
                                        <span className="text-sm text-chocolate-600">Active Members</span>
                                    </div>
                                    <select
                                        className="text-sm border border-cream-300 rounded px-2 py-1 text-chocolate-600"
                                        value={selectedTimeframe}
                                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                                    >
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                            </div>
                            <div className="h-64 bg-gradient-to-b from-mustard-50 to-chocolate-50 rounded-lg flex items-end justify-center space-x-2 p-4">
                                {/* Simplified chart representation */}
                                <div className="flex items-end space-x-1">
                                    {[30, 45, 35, 60, 40, 70, 55, 80, 65, 90, 75, 85].map((height, index) => (
                                        <div key={index} className="flex flex-col items-center space-y-1">
                                            <div className="w-2 bg-mustard-500 rounded-t" style={{ height: `${height}%` }}></div>
                                            <div className="w-2 bg-chocolate-500 rounded-t" style={{ height: `${height * 0.8}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Performance Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-chocolate-700">Event Performance</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-mustard-500 rounded-full"></div>
                                        <span className="text-sm text-chocolate-600">Music Events</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-sand-500 rounded-full"></div>
                                        <span className="text-sm text-chocolate-600">Drama Events</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64 flex items-center justify-center">
                                <div className="relative w-32 h-32">
                                    {/* Simplified radar chart */}
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <polygon
                                            points="50,10 70,30 60,70 40,70 30,30"
                                            fill="rgba(244, 196, 48, 0.3)"
                                            stroke="rgb(244, 196, 48)"
                                            strokeWidth="2"
                                        />
                                        <polygon
                                            points="50,15 65,35 55,65 45,65 35,35"
                                            fill="rgba(139, 69, 19, 0.3)"
                                            stroke="rgb(139, 69, 19)"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Activity Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-chocolate-700">Monthly Activity</h3>
                                    <p className="text-sm text-chocolate-500">Last 3 Months</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                {activityData.map((item, index) => (
                                    <div key={index} className="text-center">
                                        <div className={`text-lg font-semibold ${item.trend === 'up' ? 'text-mustard-600' : 'text-orange-600'
                                            }`}>
                                            {item.value} {item.trend === 'up' ? <ArrowUp className="w-4 h-4 inline" /> : <ArrowDown className="w-4 h-4 inline" />}
                                        </div>
                                        <div className="text-sm text-chocolate-500">{item.month}</div>
                                        <div className="text-xs text-chocolate-400">+{item.newMembers} new</div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-32 bg-gradient-to-r from-mustard-100 to-chocolate-100 rounded-lg flex items-end justify-center space-x-4 p-4">
                                {[60, 80, 40].map((height, index) => (
                                    <div key={index} className="w-8 bg-gradient-to-t from-mustard-500 to-chocolate-500 rounded-t" style={{ height: `${height}%` }}></div>
                                ))}
                            </div>
                        </div>

                        {/* Yearly Events Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-chocolate-700">Yearly Events</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-mustard-500 rounded-full"></div>
                                        <span className="text-sm text-chocolate-600">2022</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-chocolate-500 rounded-full"></div>
                                        <span className="text-sm text-chocolate-600">2023</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-sand-500 rounded-full"></div>
                                        <span className="text-sm text-chocolate-600">2024</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-32 flex items-end justify-center space-x-2">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                                    <div key={index} className="flex flex-col items-center space-y-1">
                                        <div className="flex items-end space-x-1">
                                            <div className="w-3 bg-mustard-500 rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                                            <div className="w-3 bg-chocolate-500 rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                                            <div className="w-3 bg-sand-500 rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                                        </div>
                                        <span className="text-xs text-chocolate-500">{month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Members */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                            <h3 className="text-lg font-semibold text-chocolate-700 mb-4">Recent Members</h3>
                            <div className="space-y-3">
                                {recentMembers.map((member) => (
                                    <div key={member.id} className="flex items-center space-x-3 p-3 bg-cream-50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-mustard-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {member.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-chocolate-700">{member.name}</div>
                                            <div className="text-xs text-chocolate-500">{member.faculty} • {member.year}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs ${member.status === 'active' ? 'bg-mustard-100 text-mustard-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {member.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                            <h3 className="text-lg font-semibold text-chocolate-700 mb-4">Upcoming Events</h3>
                            <div className="space-y-3">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="p-3 bg-cream-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-chocolate-700">{event.title}</h4>
                                            <span className="text-xs text-chocolate-500">{event.date}</span>
                                        </div>
                                        <div className="text-xs text-chocolate-500 mb-2">{event.time} • {event.location}</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-chocolate-600">
                                                {event.attendees}/{event.maxCapacity} attending
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs ${event.type === 'music' ? 'bg-mustard-100 text-mustard-700' :
                                                    event.type === 'drama' ? 'bg-chocolate-100 text-chocolate-700' :
                                                        'bg-sand-100 text-sand-700'
                                                }`}>
                                                {event.type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                            <h3 className="text-lg font-semibold text-chocolate-700 mb-4">Recent Activities</h3>
                            <div className="space-y-3">
                                {recentActivities.map((activity) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={activity.id} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-chocolate-100 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-4 h-4 text-chocolate-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-chocolate-700 text-sm">{activity.title}</div>
                                                <div className="text-xs text-chocolate-500">{activity.description}</div>
                                                <div className="text-xs text-chocolate-400 mt-1">{activity.timestamp}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                        </>
                    )}

                    {/* View Modal */}
                    {showViewModal && selectedItem && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-cream-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-chocolate-700">
                                            {modalType === 'user' ? 'User Details' : 'Application Details'}
                                        </h2>
                                        <button
                                            onClick={closeModals}
                                            className="p-2 text-chocolate-400 hover:text-chocolate-600 transition-colors"
                                        >
                                            <span className="text-2xl">×</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {modalType === 'user' ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Full Name</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).fullName}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Email</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).email}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Phone</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).phone}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Student ID</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).studentIndexId}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Role</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).role}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Status</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).status}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Faculty</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).faculty}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Year</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).year}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Created At</label>
                                                    <p className="text-chocolate-800">{new Date((selectedItem as User).createdAt).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Last Login</label>
                                                    <p className="text-chocolate-800">{new Date((selectedItem as User).lastLogin).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Email Verified</label>
                                                    <p className="text-chocolate-800">{(selectedItem as User).isEmailVerified ? 'Yes' : 'No'}</p>
                                                </div>
                                                {(selectedItem as User).linkedin && (
                                                    <div>
                                                        <label className="block text-sm font-semibold text-chocolate-600 mb-1">LinkedIn</label>
                                                        <p className="text-chocolate-800">{(selectedItem as User).linkedin}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Name</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).name}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Email</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).email}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Student ID</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).studentIndexId}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Status</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).status}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Faculty</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).faculty}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Year</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).year}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Interests</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).interests.join(', ')}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Applied Date</label>
                                                    <p className="text-chocolate-800">{new Date((selectedItem as Application).timestamp).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Email Sent</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).isEmailSend ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                            {(selectedItem as Application).message && (
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Message</label>
                                                    <p className="text-chocolate-800">{(selectedItem as Application).message}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && selectedItem && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-cream-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-chocolate-700">
                                            Edit {modalType === 'user' ? 'User' : 'Application'}
                                        </h2>
                                        <button
                                            onClick={closeModals}
                                            className="p-2 text-chocolate-400 hover:text-chocolate-600 transition-colors"
                                        >
                                            <span className="text-2xl">×</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {modalType === 'user' ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                                            {/* Profile Image Upload Section */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-chocolate-600 mb-3">Profile Image</label>
                                                <div className="flex items-center space-x-4">
                                                    {/* Image Preview */}
                                                    <div className="relative">
                                                        <div className="w-20 h-20 rounded-full overflow-hidden bg-cream-100 border-2 border-cream-300 flex items-center justify-center">
                                                            {imagePreview ? (
                                                                <img 
                                                                    src={imagePreview} 
                                                                    alt="Profile Preview" 
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <img 
                                                                    src="/image/profile.png" 
                                                                    alt="Default Profile" 
                                                                    className="w-full h-full object-cover"
                                                                                                                                    onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                    const nextElement = target.nextElementSibling as HTMLElement;
                                                                    if (nextElement) {
                                                                        nextElement.style.display = 'block';
                                                                    }
                                                                }}
                                                                />
                                                            )}
                                                            <User className="w-8 h-8 text-chocolate-400 hidden" />
                                                        </div>
                                                        {imagePreview && (
                                                            <button
                                                                type="button"
                                                                onClick={removeImage}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Upload Button */}
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            id="profile-image-input"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor="profile-image-input"
                                                            className="inline-flex items-center px-4 py-2 bg-mustard-500 text-white rounded-lg hover:bg-mustard-600 transition-colors cursor-pointer"
                                                        >
                                                            <Image className="w-4 h-4 mr-2" />
                                                            {imagePreview ? 'Change Image' : 'Upload Image'}
                                                        </label>
                                                        <p className="text-xs text-chocolate-500 mt-1">
                                                            Max size: 2MB. Supported formats: JPG, PNG, GIF, WebP
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={editFormData.fullName || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editFormData.email || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={editFormData.phone || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Student ID</label>
                                                    <input
                                                        type="text"
                                                        name="studentIndexId"
                                                        value={editFormData.studentIndexId || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Role</label>
                                                    <select
                                                        name="role"
                                                        value={editFormData.role || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="president">President</option>
                                                        <option value="vice_president">Vice President</option>
                                                        <option value="student_coordinator">Student Coordinator</option>
                                                        <option value="secretary">Secretary</option>
                                                        <option value="assistant_secretary">Assistant Secretary</option>
                                                        <option value="treasurer">Treasurer</option>
                                                        <option value="social_media_manager">Social Media Manager</option>
                                                        <option value="editor">Editor</option>
                                                        <option value="committee_member">Committee Member</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Status</label>
                                                    <select
                                                        name="status"
                                                        value={editFormData.status || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Faculty</label>
                                                    <select
                                                        name="faculty"
                                                        value={editFormData.faculty || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
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
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Year</label>
                                                    <select
                                                        name="year"
                                                        value={editFormData.year || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
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
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">LinkedIn</label>
                                                    <input
                                                        type="url"
                                                        name="linkedin"
                                                        value={editFormData.linkedin || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={closeModals}
                                                    className="px-4 py-2 text-chocolate-600 border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-mustard-500 text-white rounded-lg hover:bg-mustard-600 disabled:opacity-50 transition-colors"
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editFormData.name || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editFormData.email || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Student ID</label>
                                                    <input
                                                        type="text"
                                                        name="studentIndexId"
                                                        value={editFormData.studentIndexId || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Status</label>
                                                    <select
                                                        name="status"
                                                        value={editFormData.status || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Faculty</label>
                                                    <select
                                                        name="faculty"
                                                        value={editFormData.faculty || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
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
                                                <div>
                                                    <label className="block text-sm font-semibold text-chocolate-600 mb-1">Year</label>
                                                    <select
                                                        name="year"
                                                        value={editFormData.year || ''}
                                                        onChange={handleInputChangeEdit}
                                                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
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
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-chocolate-600 mb-1">Interests</label>
                                                <input
                                                    type="text"
                                                    name="interests"
                                                    value={Array.isArray(editFormData.interests) ? editFormData.interests.join(', ') : ''}
                                                    onChange={(e) => {
                                                        const interests = e.target.value.split(',').map(i => i.trim()).filter(i => i);
                                                        setEditFormData((prev: any) => ({ ...prev, interests }));
                                                    }}
                                                    placeholder="music, drama, art, meditation"
                                                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-chocolate-600 mb-1">Message</label>
                                                <textarea
                                                    name="message"
                                                    value={editFormData.message || ''}
                                                    onChange={handleInputChangeEdit}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mustard-500"
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={closeModals}
                                                    className="px-4 py-2 text-chocolate-600 border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-mustard-500 text-white rounded-lg hover:bg-mustard-600 disabled:opacity-50 transition-colors"
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
         );
 };
 
 export default Dashboard;
