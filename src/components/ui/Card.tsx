import React, { ReactNode } from 'react';

interface CardProps {
    title?: ReactNode;
    children: ReactNode;
    imageUrl?: string;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
    title, 
    children, 
    imageUrl, 
    className = '', 
    header, 
    footer 
}) => {
    return (
        <div className={`bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
            {imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>
            )}
            {header && (
                <div className="border-b p-3 sm:p-4 bg-gray-50">
                    {header}
                </div>
            )}
            {title && (
                <div className="p-3 sm:p-4 pb-0">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2 text-gray-800">
                        {title}
                    </h2>
                </div>
            )}
            <div className="p-3 sm:p-4 text-gray-600">
                {children}
            </div>
            {footer && (
                <div className="border-t p-3 sm:p-4 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;