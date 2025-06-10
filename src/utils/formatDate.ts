// This file contains utility functions for formatting dates.

/**
 * Форматирует дату в соответствии с выбранной локалью
 * @param date Строка с датой или объект Date
 * @param locale Код локали ('uk' или 'en')
 * @returns Отформатированная дата
 */
export const formatDate = (date: Date | string, locale: string = 'uk'): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-GB', options);
};

/**
 * Форматирует дату и время в соответствии с выбранной локалью
 * @param date Строка с датой или объект Date
 * @param locale Код локали ('uk' или 'en')
 * @returns Отформатированная дата и время
 */
export const formatDateTime = (date: Date | string, locale: string = 'uk'): string => {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(date).toLocaleString(locale === 'uk' ? 'uk-UA' : 'en-GB', options);
};

/**
 * Возвращает относительное время (например, "5 минут назад")
 * @param date Строка с датой или объект Date
 * @param locale Код локали ('uk' или 'en')
 * @returns Относительная дата
 */
export const getRelativeTime = (date: Date | string, locale: string = 'uk'): string => {
    const targetDate = new Date(date);
    const now = new Date();
    const rtf = new Intl.RelativeTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', { numeric: 'auto' });
    
    // Конвертируем разницу в секунды
    const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
    
    // Определяем единицы времени
    if (Math.abs(diffInSeconds) < 60) {
        return rtf.format(diffInSeconds, 'second');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
        return rtf.format(diffInMinutes, 'minute');
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
        return rtf.format(diffInHours, 'hour');
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
        return rtf.format(diffInDays, 'day');
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
        return rtf.format(diffInMonths, 'month');
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(diffInYears, 'year');
};