'use client';

import { useState, useEffect } from 'react';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  category: 'lesson' | 'news' | 'blog' | 'application';
  tags: string[];
  author: string;
  date: Date;
  status?: 'active' | 'inactive' | 'pending' | 'completed';
}

export default function SearchPage() {
  const { dictionary, locale } = useDictionary();
  const { profile, isAuthenticated } = useAuth();
  const { showInfo } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredItems, setFilteredItems] = useState<SearchableItem[]>([]);
  const [allItems, setAllItems] = useState<SearchableItem[]>([]);

  // Mock data
  useEffect(() => {
    const mockItems: SearchableItem[] = [
      {
        id: '1',
        title: 'Основи механіки',
        description: 'Вивчення основних принципів класичної механіки, законів Ньютона та їх застосування',
        category: 'lesson',
        tags: ['фізика', 'механіка', 'ньютон'],
        author: 'Іван Петрович',
        date: new Date(2025, 5, 10),
        status: 'active'
      },
      {
        id: '2',
        title: 'Квадратні рівняння',
        description: 'Методи розв\'язування квадратних рівнянь та їх практичне застосування',
        category: 'lesson',
        tags: ['математика', 'алгебра', 'рівняння'],
        author: 'Марія Іванівна',
        date: new Date(2025, 5, 8),
        status: 'active'
      },
      {
        id: '3',
        title: 'Новини освіти',
        description: 'Останні новини та оновлення в освітній сфері України',
        category: 'news',
        tags: ['освіта', 'новини', 'україна'],
        author: 'Редакція',
        date: new Date(2025, 5, 12),
        status: 'active'
      },
      {
        id: '4',
        title: 'Заявка на курс фізики',
        description: 'Заявка на участь в курсі "Загальна фізика" для початківців',
        category: 'application',
        tags: ['заявка', 'фізика', 'курс'],
        author: 'Анна Коваленко',
        date: new Date(2025, 5, 5),
        status: 'pending'
      },
      {
        id: '5',
        title: 'Ефективні методи навчання',
        description: 'Блог про сучасні підходи до навчання та викладання точних наук',
        category: 'blog',
        tags: ['методика', 'навчання', 'педагогіка'],
        author: 'Олег Сидоренко',
        date: new Date(2025, 5, 1),
        status: 'active'
      }
    ];

    setAllItems(mockItems);
    setFilteredItems(mockItems);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = allItems;

    // Search by query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.author.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'date':
        default:
          comparison = a.date.getTime() - b.date.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder, allItems]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lesson':
        return '📚';
      case 'news':
        return '📰';
      case 'blog':
        return '📝';
      case 'application':
        return '📋';
      default:
        return '📄';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lesson':
        return 'Урок';
      case 'news':
        return 'Новини';
      case 'blog':
        return 'Блог';
      case 'application':
        return 'Заявка';
      default:
        return category;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Активний';
      case 'inactive':
        return 'Неактивний';
      case 'pending':
        return 'Очікування';
      case 'completed':
        return 'Завершено';
      default:
        return status || 'Невідомо';
    }
  };

  const handleSearch = () => {
    showInfo(
      'Пошук виконано',
      `Знайдено ${filteredItems.length} результатів`,
      2000
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🔍 Пошук та фільтрація
            </h1>
            <p className="text-gray-600">
              Знайдіть потрібну інформацію за допомогою розширеного пошуку та фільтрів
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🎛️ Фільтри
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категорія
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Всі категорії</option>
                    <option value="lesson">📚 Уроки</option>
                    <option value="news">📰 Новини</option>
                    <option value="blog">📝 Блог</option>
                    <option value="application">📋 Заявки</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Всі статуси</option>
                    <option value="active">✅ Активний</option>
                    <option value="pending">⏳ Очікування</option>
                    <option value="completed">✔️ Завершено</option>
                    <option value="inactive">❌ Неактивний</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сортування
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'author')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  >
                    <option value="date">📅 За датою</option>
                    <option value="title">📝 За назвою</option>
                    <option value="author">👤 За автором</option>
                  </select>
                  
                  <div className="flex space-x-2">                    <Button
                      onClick={() => setSortOrder('asc')}
                      variant={sortOrder === 'asc' ? 'primary' : 'secondary'}
                      className="flex-1 text-sm"
                    >
                      ↑ За зростанням
                    </Button>
                    <Button
                      onClick={() => setSortOrder('desc')}
                      variant={sortOrder === 'desc' ? 'primary' : 'secondary'}
                      className="flex-1 text-sm"
                    >
                      ↓ За спаданням
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSortBy('date');
                    setSortOrder('desc');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  🔄 Скинути фільтри
                </Button>
              </Card>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <Card className="p-6 mb-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Пошук за назвою, описом, тегами або автором..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} className="px-8">
                    🔍 Пошук
                  </Button>
                </div>
              </Card>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Знайдено <span className="font-semibold">{filteredItems.length}</span> результатів
                  {searchQuery && (
                    <span> за запитом "<span className="font-semibold">{searchQuery}</span>"</span>
                  )}
                </p>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>👤 {item.author}</span>
                              <span>📅 {item.date.toLocaleDateString('uk-UA')}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {getCategoryLabel(item.category)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {item.status && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <Button variant="secondary">
                          📖 Переглянути
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Результатів не знайдено
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Спробуйте змінити параметри пошуку або скинути фільтри
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                      }}
                    >
                      🔄 Скинути пошук
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
