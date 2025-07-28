import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  isVisible, 
  onClose, 
  duration = 5000 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 500); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = "fixed top-6 right-6 z-[9999] max-w-md w-full transform transition-all duration-500 ease-out shadow-2xl";
    const animationStyles = isAnimating 
      ? "translate-x-0 opacity-100 scale-100" 
      : "translate-x-full opacity-0 scale-95";
    
    return `${baseStyles} ${animationStyles}`;
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20',
          border: 'border-green-200 dark:border-green-700/50',
          icon: 'text-green-600 dark:text-green-400',
          iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800/40 dark:to-emerald-800/30',
          text: 'text-green-800 dark:text-green-200',
          shadow: 'shadow-green-200/50 dark:shadow-green-900/20'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/20',
          border: 'border-red-200 dark:border-red-700/50',
          icon: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-800/40 dark:to-rose-800/30',
          text: 'text-red-800 dark:text-red-200',
          shadow: 'shadow-red-200/50 dark:shadow-red-900/20'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/20',
          border: 'border-yellow-200 dark:border-yellow-700/50',
          icon: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-800/40 dark:to-amber-800/30',
          text: 'text-yellow-800 dark:text-yellow-200',
          shadow: 'shadow-yellow-200/50 dark:shadow-yellow-900/20'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20',
          border: 'border-blue-200 dark:border-blue-700/50',
          icon: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-800/40 dark:to-cyan-800/30',
          text: 'text-blue-800 dark:text-blue-200',
          shadow: 'shadow-blue-200/50 dark:shadow-blue-900/20'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/20',
          border: 'border-gray-200 dark:border-gray-700/50',
          icon: 'text-gray-600 dark:text-gray-400',
          iconBg: 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/40 dark:to-slate-800/30',
          text: 'text-gray-800 dark:text-gray-200',
          shadow: 'shadow-gray-200/50 dark:shadow-gray-900/20'
        };
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <AlertTriangle className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'info':
        return <Info className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={getToastStyles()}>
      <div className={`${styles.bg} ${styles.border} ${styles.shadow} border rounded-2xl backdrop-blur-xl relative overflow-hidden`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent dark:from-white/5"></div>
        
        {/* Content */}
        <div className="relative flex items-start p-5">
          {/* Icon */}
          <div className={`${styles.iconBg} ${styles.icon} rounded-xl p-2 mr-4 mt-0.5 shadow-sm`}>
            {getIcon()}
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className={`${styles.text} text-sm font-semibold leading-relaxed`}>
              {message}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className={`${styles.text} hover:opacity-70 hover:scale-110 transition-all duration-200 ml-3 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20">
          <div 
            className="h-full bg-current transition-all duration-300 ease-linear"
            style={{ 
              width: isAnimating ? '100%' : '0%',
              transitionDuration: `${duration}ms`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast; 