import React, { useState, useEffect } from 'react';
import { Search, Headphones, TrendingUp, Building2, FileText, Grid3X3, Settings, MapPin, Bell, BarChart3, User, ArrowUp, ArrowDown, Music, Calendar, Award, UserCheck, Image, Crown, ArrowLeft, Plus, MicIcon, Palette, Heart, Users } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { database } from '../firebase/firebase';

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

    useEffect(() => {
        setIsVisible(true);
    }, []);

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
            console.error('Error adding event:', error);
            alert('Error adding event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Updated Navigation with your specific requirements
    const mainNavItems = [
        { id: 'dashboard', icon: Grid3X3, label: 'Dashboard', count: 0 },
        { id: 'executive', icon: Crown, label: 'Executive Member', count: 8 },
        { id: 'general', icon: UserCheck, label: 'General Member', count: 1247 },
        { id: 'event', icon: Calendar, label: 'Event', count: 15 },
        { id: 'gallery', icon: Image, label: 'Gallery', count: 23 },
        { id: 'settings', icon: Settings, label: 'Settings', count: 3 },
    ];

    const summaryCards = [
        {
            title: 'Total Members',
            subtitle: 'Active Members',
            value: '1,247',
            usage: '85%',
            remaining: '15%',
            icon: UserCheck,
            color: 'chocolate',
            progress: 85,
            change: '+12.5%',
            trend: 'up',
            details: {
                newThisMonth: 45,
                activeToday: 89,
                totalRegistrations: 1567
            }
        },
        {
            title: 'Active Events',
            subtitle: 'This Month',
            value: '8',
            usage: '75%',
            remaining: '25%',
            icon: Calendar,
            color: 'chocolate',
            progress: 75,
            change: '+3',
            trend: 'up',
            details: {
                upcoming: 5,
                ongoing: 3,
                completed: 12
            }
        },
        {
            title: 'Music Sessions',
            subtitle: 'Completed',
            value: '24',
            usage: '60%',
            remaining: '40%',
            icon: Music,
            color: 'chocolate',
            progress: 60,
            change: '+8.2%',
            trend: 'up',
            details: {
                thisWeek: 3,
                thisMonth: 8,
                totalSessions: 156
            }
        }
    ];

    const activityData = [
        { month: 'August', value: '156', trend: 'up', newMembers: 23, events: 4 },
        { month: 'September', value: '189', trend: 'up', newMembers: 34, events: 6 },
        { month: 'October', value: '145', trend: 'down', newMembers: 18, events: 3 }
    ];

    const recentMembers: any[] = [];

    const upcomingEvents: any[] = [];

    const recentActivities: any[] = [];

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

                    {/* Navigation - Updated with your specific menu items */}
                    <nav className="flex flex-col space-y-6 w-full px-4">
                        {mainNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
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
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gradient-mustard">Add New Event</h1>
                                    <p className="text-chocolate-600 mt-1">Create an exciting new event for the NIBM Club</p>
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

                            <div className="bg-white rounded-2xl shadow-lg border border-cream-200">
                                {/* Event Form */}
                                <div className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Event Name */}
                                        <div>
                                            <label htmlFor="eventName" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Event Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="eventName"
                                                name="eventName"
                                                value={formData.eventName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900 placeholder-chocolate-400"
                                                placeholder="Enter event name"
                                            />
                                        </div>

                                        {/* Organized By */}
                                        <div>
                                            <label htmlFor="organizedBy" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Organized By *
                                            </label>
                                            <input
                                                type="text"
                                                id="organizedBy"
                                                name="organizedBy"
                                                value={formData.organizedBy}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900 placeholder-chocolate-400"
                                                placeholder="Enter organizer name"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Description *
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900 placeholder-chocolate-400 resize-none"
                                                placeholder="Describe your event..."
                                            />
                                        </div>

                                        {/* Image URL */}
                                        <div>
                                            <label htmlFor="imageUrl" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Event Image URL
                                            </label>
                                            <input
                                                type="url"
                                                id="imageUrl"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900 placeholder-chocolate-400"
                                                placeholder="Enter image URL (optional)"
                                            />
                                        </div>

                                        {/* Event Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Event Type *
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {eventTypes.map((type) => (
                                                    <label
                                                        key={type.value}
                                                        className={`relative cursor-pointer p-4 border-2 rounded-lg transition-all ${formData.eventType === type.value
                                                            ? 'border-mustard-500 bg-mustard-50'
                                                            : 'border-cream-300 hover:border-mustard-300'
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
                                                            <span className="text-2xl mb-2 block">{type.emoji}</span>
                                                            <span className="text-sm font-medium text-chocolate-700">
                                                                {type.label}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Date and Time */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="eventDate" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                    Event Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    id="eventDate"
                                                    name="eventDate"
                                                    value={formData.eventDate}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="startTime" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                    Start Time *
                                                </label>
                                                <input
                                                    type="time"
                                                    id="startTime"
                                                    name="startTime"
                                                    value={formData.startTime}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="endTime" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                    End Time *
                                                </label>
                                                <input
                                                    type="time"
                                                    id="endTime"
                                                    name="endTime"
                                                    value={formData.endTime}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900"
                                                />
                                            </div>
                                        </div>

                                        {/* Venue */}
                                        <div>
                                            <label htmlFor="venue" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Venue *
                                            </label>
                                            <input
                                                type="text"
                                                id="venue"
                                                name="venue"
                                                value={formData.venue}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900 placeholder-chocolate-400"
                                                placeholder="Enter venue location"
                                            />
                                        </div>

                                        {/* Contact Person */}
                                        <div>
                                            <label htmlFor="contactPerson" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Contact Person *
                                            </label>
                                            <input
                                                type="text"
                                                id="contactPerson"
                                                name="contactPerson"
                                                value={formData.contactPerson}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900 placeholder-chocolate-400"
                                                placeholder="Enter contact person name"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                Status *
                                            </label>
                                            <select
                                                id="status"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900"
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status.value} value={status.value}>
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Registration Required */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-chocolate-700 mb-2">
                                                <input
                                                    type="checkbox"
                                                    name="registrationRequired"
                                                    checked={formData.registrationRequired}
                                                    onChange={handleInputChange}
                                                    className="mr-2 rounded text-mustard-600 focus:ring-mustard-500"
                                                />
                                                Registration Required
                                            </label>
                                        </div>

                                        {/* Registration Deadline - Only show if registration is required */}
                                        {formData.registrationRequired && (
                                            <div>
                                                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-chocolate-700 mb-2">
                                                    Registration Deadline *
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    id="registrationDeadline"
                                                    name="registrationDeadline"
                                                    value={formData.registrationDeadline}
                                                    onChange={handleInputChange}
                                                    required={formData.registrationRequired}
                                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900"
                                                />
                                            </div>
                                        )}

                                        {/* Max Participants - Only show if registration is required */}
                                        {formData.registrationRequired && (
                                            <div>
                                                <label htmlFor="maxParticipants" className="block text-sm font-medium text-chocolate-700 mb-2">
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
                                                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-mustard-500 focus:border-transparent bg-white text-chocolate-900"
                                                    placeholder="Enter maximum number of participants"
                                                />
                                            </div>
                                        )}

                                        {/* Is Active */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-chocolate-700 mb-2">
                                                <input
                                                    type="checkbox"
                                                    name="isActive"
                                                    checked={formData.isActive}
                                                    onChange={handleInputChange}
                                                    className="mr-2 rounded text-mustard-600 focus:ring-mustard-500"
                                                />
                                                Event is Active
                                            </label>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-mustard-500 to-orange-500 hover:from-mustard-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        <span>Adding Event...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-5 h-5" />
                                                        <span>Add Event</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
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

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                                <h2 className="text-xl font-semibold text-chocolate-700 mb-4">Executive Member Management</h2>
                                <p className="text-chocolate-600">Executive member management functionality will be implemented here.</p>
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

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-200">
                                <h2 className="text-xl font-semibold text-chocolate-700 mb-4">General Member Management</h2>
                                <p className="text-chocolate-600">General member management functionality will be implemented here.</p>
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
                                            <div className={`w-16 h-12 rounded-full bg-${card.color}-100 flex items-center justify-center`}>
                                                <Icon className={`w-6 h-6 text-${card.color}-600`} />
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
                                            <div className={`w-8 h-8 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                                                <Icon className={`w-4 h-4 text-${activity.color}-600`} />
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
                </div>
            </div>
        </div>
         );
 };
 
 export default Dashboard;
