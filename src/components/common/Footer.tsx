import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';

async function Footer({ locale }: { locale: string }) {
  const { common } = await getDictionary(locale);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">📚</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {locale === 'uk' ? 'Фізика & Математика' : 'Physics & Math'}
                </h3>
                <p className="text-gray-400">
                  {common.online_learning}
                </p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {common.modern_approach_detailed}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xl">📧</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xl">💬</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xl">📱</span>
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {common.navigation}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  🏠 {common.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  📝 {common.blog}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/news`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  📰 {common.news}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/lessons`} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  🎓 {common.lessons}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              {locale === 'uk' ? 'Контакти' : 'Contact'}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">📧</span>
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <a href="mailto:teacher@example.com" className="text-white hover:text-blue-400 transition-colors">
                    teacher@example.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">📱</span>
                <div>
                  <p className="text-gray-300 text-sm">
                    {locale === 'uk' ? 'Телефон' : 'Phone'}
                  </p>
                  <a href="tel:+380123456789" className="text-white hover:text-green-400 transition-colors">
                    +38 (012) 345-67-89
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">🕐</span>
                <div>
                  <p className="text-gray-300 text-sm">
                    {locale === 'uk' ? 'Графік роботи' : 'Working Hours'}
                  </p>
                  <p className="text-white">
                    {locale === 'uk' ? 'Пн-Пт: 9:00-18:00' : 'Mon-Fri: 9:00-18:00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {locale === 'uk' ? 'Фізика & Математика' : 'Physics & Math'}. 
              {locale === 'uk' ? ' Всі права захищені.' : ' All rights reserved.'}
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white transition-colors">
                {locale === 'uk' ? 'Політика конфіденційності' : 'Privacy Policy'}
              </Link>
              <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white transition-colors">
                {locale === 'uk' ? 'Умови використання' : 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;