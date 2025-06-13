'use client';

import { useState, useRef } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File) => Promise<void>;
  size?: 'small' | 'medium' | 'large';
  userName: string;
}

const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarChange, 
  size = 'medium', 
  userName 
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useNotifications();

  const sizeClasses = {
    small: 'w-10 h-10 text-sm',
    medium: 'w-16 h-16 text-lg',
    large: 'w-24 h-24 text-2xl'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация файла
    if (!file.type.startsWith('image/')) {
      showError('Помилка', 'Будь ласка, оберіть файл зображення');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      showError('Помилка', 'Розмір файлу не повинен перевищувати 5MB');
      return;
    }

    // Показуємо превью
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Завантажуємо файл
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await onAvatarChange(file);
      showSuccess('Успіх!', 'Аватар успішно оновлено');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showError('Помилка', 'Не вдалося завантажити аватар');
      setPreviewUrl(currentAvatar || null); // Відновлюємо попередній аватар
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer relative bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}
        onClick={handleClick}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </span>
        )}
        
        {/* Overlay при наведенні */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Невидимий input для файлів */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Індикатор завантаження */}
      {isUploading && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
