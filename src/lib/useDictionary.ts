'use client';

import { useParams } from 'next/navigation';
import ukDictionary from '../../public/locales/uk/dictionary.json';
import enDictionary from '../../public/locales/en/dictionary.json';
import { Dictionary } from '@/types/dictionary';

const dictionaries: Record<string, Dictionary> = {
  uk: ukDictionary as Dictionary,
  en: enDictionary as Dictionary,
};

export function useDictionary() {
  const params = useParams();
  const locale = (params?.locale as string) || 'uk';
  
  return {
    dictionary: dictionaries[locale as keyof typeof dictionaries] || dictionaries.uk,
    locale,
  };
}
