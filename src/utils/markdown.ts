import DOMPurify from 'isomorphic-dompurify';
import { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Преобразует Markdown в HTML
 * @param markdown Исходный markdown текст
 * @returns HTML-контент
 */
export const parseMarkdown = (markdown: string): string => {
    // Этот метод оставлен для обратной совместимости
    // Рекомендуется использовать renderMarkdown для безопасного рендеринга
    const sanitized = sanitizeMarkdown(markdown);
    return sanitized;
};

/**
 * Безопасное очищение текста от потенциально опасных XSS
 * @param html HTML-контент для очистки
 * @returns Очищенный HTML
 */
export const sanitizeMarkdown = (html: string): string => {
    return DOMPurify.sanitize(html);
};

/**
 * Безопасное преобразование Markdown в React-компоненты
 * @param markdown Исходный markdown текст
 * @returns React-компонент с отрендеренным Markdown
 */
export const renderMarkdown = (markdown: string): ReactElement => {
    // Очистка входного markdown-контента
    const sanitized = sanitizeMarkdown(markdown);
    
    // Преобразование Markdown в React-элементы
    return ReactMarkdown({ children: sanitized }) as ReactElement;
};

/**
 * Создание выдержки из Markdown-текста
 * @param markdown Исходный markdown текст
 * @param length Максимальная длина выдержки
 * @returns Текстовая выдержка без markdown-разметки
 */
export const createExcerpt = (markdown: string, length: number = 150): string => {
    // Удаление markdown-разметки
    const plainText = markdown
        .replace(/#{1,6}\s+/g, '') // Удаление заголовков
        .replace(/\*\*|__/g, '') // Удаление жирного текста
        .replace(/\*|_/g, '') // Удаление курсива
        .replace(/~~(.*)~~/g, '$1') // Удаление зачеркивания
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Замена ссылок на их текст
        .replace(/!\[(.*?)\]\(.*?\)/g, '') // Удаление изображений
        .replace(/```[\s\S]*?```/g, '') // Удаление блоков кода
        .replace(/`([^`]+)`/g, '$1') // Удаление строчного кода
        .replace(/\n/g, ' ') // Замена переносов строк на пробелы
        .replace(/\s+/g, ' ') // Удаление множественных пробелов
        .trim(); // Удаление начальных и конечных пробелов
    
    // Создание выдержки
    if (plainText.length <= length) {
        return plainText;
    }
    
    return plainText.substring(0, length) + '...';
};