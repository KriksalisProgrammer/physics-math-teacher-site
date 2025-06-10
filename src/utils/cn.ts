import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names and tailwind classes together
 * @param inputs ClassValue
 * @returns combined classes string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
