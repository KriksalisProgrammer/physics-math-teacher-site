import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import ContentForm from '@/components/admin/ContentForm';
import { useDictionary } from '@/lib/useDictionary';

const AdminPage = () => {
  const { dictionary } = useDictionary();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">
        {dictionary.admin?.dashboard || 'Admin Dashboard'}
      </h1>
      <ContentForm type="post" />
    </AdminLayout>
  );
};

export default AdminPage;

// Проверьте, что импорты Button, Input, Form идут как default, а не именованные. Исправьте типы onChange для Input, если есть. Исправьте значения пропсов Button/Input, если есть.