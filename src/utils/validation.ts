// src/utils/validation.ts

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters long and contain at least one number and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

export const validateRequiredField = (value: string): boolean => {
    return value.trim().length > 0;
};

export const isValidUrl = (urlString: string): boolean => {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        // Игнорируем ошибку, просто возвращаем false для невалидных URL
        return false;
    }
};

export const validateForm = (formData: Record<string, string>): Record<string, string | null> => {
    const errors: Record<string, string | null> = {};

    if (!validateRequiredField(formData.email)) {
        errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Invalid email format';
    }

    if (!validateRequiredField(formData.password)) {
        errors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
        errors.password = 'Password must be at least 8 characters long and contain at least one number';
    }

    return errors;
};