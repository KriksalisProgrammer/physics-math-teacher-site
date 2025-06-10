'use client';

import React from 'react';
import ResponsiveSidebar from '../admin/ResponsiveSidebar';
import Header from '../common/Header';
import { useDictionary } from '../../lib/useDictionary';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { locale } = useDictionary();
    
    return (
        <div className="flex flex-col h-screen">
            <Header locale={locale} />
            <div className="flex flex-1">
                <ResponsiveSidebar />
                <main className="flex-1 p-4 lg:p-6 bg-gray-100 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;