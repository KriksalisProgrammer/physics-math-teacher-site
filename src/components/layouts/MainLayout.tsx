import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
    locale: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, locale }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header locale={locale} />
            <main className="flex-grow">{children}</main>
            <Footer locale={locale} />
        </div>
    );
};

export default MainLayout;