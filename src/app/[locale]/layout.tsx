import { Inter } from 'next/font/google';
import { getDictionary } from '@/lib/dictionaries';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
// import NavbarTest from '@/components/common/NavbarTest';
import type { User, Session } from '@supabase/supabase-js';
import '../../styles/globals.css';

// Initialize font
const inter = Inter({ subsets: ['latin', 'cyrillic'] });

// Generate static locale params for static site generation
export async function generateStaticParams() {
  return [{ locale: 'uk' }, { locale: 'en' }];
}

// Generate dynamic metadata based on locale
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  
  return {
    title: dictionary.common.site_title,
    description: dictionary.common.welcome_message
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  // Get dictionary for current locale
  const dictionary = await getDictionary(locale);
  
  // Initialize Supabase client for auth
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  }: { data: { session: Session | null } } = await supabase.auth.getSession();

  return (
    <html lang={locale} dir="ltr" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`flex flex-col min-h-screen bg-gray-50 antialiased ${inter.className}`}>
        {/* <NavbarTest /> */}
        <Header locale={locale} />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}