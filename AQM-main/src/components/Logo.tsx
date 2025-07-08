import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'main' | 'alt';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', variant = 'main' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12', 
    xl: 'h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  const logoSrc = variant === 'main' ? '/logoaqm.png' : '/logoaqm.png';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo imagen */}
      <img 
        src={logoSrc}
        alt="AQM Logo"
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
      
      {/* Texto del logo - solo en tamaños grandes */}
      {size !== 'sm' && (
        <div className="flex flex-col">
          <span className={`font-semibold ${textSizes[size]} lesbian-text`}>
            
          </span>
          {size === 'xl' && (
            <span className="text-sm text-gray-600 font-normal">
              AQM
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
