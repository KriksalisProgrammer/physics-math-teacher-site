'use client';

import { useState, useEffect } from 'react';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'lesson' | 'meeting' | 'exam' | 'homework';
  status: 'scheduled' | 'completed' | 'cancelled';
  description?: string;
  meetingLink?: string;
}

export default function CalendarPage() {
  const { dictionary, locale } = useDictionary();
  const { profile, isAuthenticated } = useAuth();
  const { showSuccess, showInfo } = useNotifications();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Mock events for demonstration
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Фізика: Механіка',
        date: new Date(2025, 5, 15, 10, 0),
        time: '10:00',
        type: 'lesson',
        status: 'scheduled',
        description: 'Вивчення основ механіки',
        meetingLink: 'https://meet.google.com/xyz'
      },
      {
        id: '2',
        title: 'Математика: Алгебра',
        date: new Date(2025, 5, 17, 14, 0),
        time: '14:00',
        type: 'lesson',
        status: 'scheduled',
        description: 'Розв\'язування квадратних рівнянь'
      },
      {
        id: '3',
        title: 'Контрольна робота',
        date: new Date(2025, 5, 20, 9, 0),
        time: '09:00',
        type: 'exam',
        status: 'scheduled',
        description: 'Підсумкова контрольна робота з фізики'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'homework':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return '📚';
      case 'meeting':
        return '🤝';
      case 'exam':
        return '📝';
      case 'homework':
        return '📋';
      default:
        return '📅';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      showInfo(
        `Події на ${date.toLocaleDateString('uk-UA')}`,
        `Знайдено ${dayEvents.length} подій`,
        3000
      );
    }
  };

  const handleJoinMeeting = (event: CalendarEvent) => {
    if (event.meetingLink) {
      window.open(event.meetingLink, '_blank');
      showSuccess(
        'Приєднання до заняття',
        `Відкрито посилання на ${event.title}`,
        3000
      );
    }
  };

  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              📅 Календар занять
            </h1>
            <p className="text-gray-600">
              Управляйте своїм розкладом та не пропускайте важливі події
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => navigateMonth('prev')}
                        variant="secondary"
                        className="p-2"
                      >
                        ←
                      </Button>
                      <Button
                        onClick={() => navigateMonth('next')}
                        variant="secondary"
                        className="p-2"
                      >
                        →
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {(['month', 'week', 'day'] as const).map((viewType) => (                      <Button
                        key={viewType}
                        onClick={() => setView(viewType)}
                        variant={view === viewType ? 'primary' : 'secondary'}
                        className="capitalize"
                      >
                        {viewType === 'month' ? 'Місяць' : 
                         viewType === 'week' ? 'Тиждень' : 'День'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate?.toDateString() === day.toDateString();
                    const dayEvents = getEventsForDate(day);

                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`
                          relative p-2 min-h-[80px] border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-blue-50
                          ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                          ${isToday ? 'bg-blue-100 border-blue-300' : ''}
                          ${isSelected ? 'ring-2 ring-blue-500' : ''}
                        `}
                      >
                        <div className="text-sm font-medium">
                          {day.getDate()}
                        </div>
                        
                        {/* Events */}
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            >
                              {getEventTypeIcon(event.type)} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} ще
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Today's Events */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📍 Події сьогодні
                </h3>
                
                {getEventsForDate(new Date()).length > 0 ? (
                  <div className="space-y-3">
                    {getEventsForDate(new Date()).map((event) => (
                      <div key={event.id} className="border-l-4 border-blue-400 pl-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">{event.title}</h4>
                          <span className="text-sm text-gray-500">{event.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        {event.meetingLink && (
                          <Button
                            onClick={() => handleJoinMeeting(event)}
                            className="mt-2 text-xs"
                          >
                            🔗 Приєднатися
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">На сьогодні подій немає</p>
                )}
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ⚡ Швидкі дії
                </h3>
                
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    ➕ Додати подію
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    📥 Імпорт календаря
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    📤 Експорт календаря
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    🔔 Нагадування
                  </Button>
                </div>
              </Card>

              {/* Legend */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🎨 Легенда
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                    <span className="text-sm">📚 Уроки</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                    <span className="text-sm">🤝 Зустрічі</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                    <span className="text-sm">📝 Іспити</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                    <span className="text-sm">📋 Домашні завдання</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
