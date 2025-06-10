import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { getDictionary } from '@/lib/dictionaries';

async function Header({ locale }: { locale: string }) {
  const { common } = await getDictionary(locale);

  return (
    <header className="bg-blue-600 text-white p-2 sm:p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <Link href={`/${locale}`} className="text-xl sm:text-2xl font-bold no-underline hover:no-underline text-center sm:text-left">
          {common.site_title}
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}

export default Header;