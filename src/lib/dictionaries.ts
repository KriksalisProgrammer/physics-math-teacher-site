import { Dictionary } from '@/types/dictionary';

// Кеш словарей для производительности
const dictionaries: Record<string, () => Promise<Dictionary>> = {
  uk: () => import('../../public/locales/uk/dictionary.json').then((module) => module.default),
  en: () => import('../../public/locales/en/dictionary.json').then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // Проверяем, доступен ли словарь для выбранной локали
  if (!dictionaries[locale]) {
    // Если недоступна, используем украинскую локаль по умолчанию
    return dictionaries.uk();
  }
  
  return dictionaries[locale]();
};
