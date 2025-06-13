'use client';

import { useState, useEffect, useRef } from 'react';
import { useDictionary } from '@/lib/useDictionary';
import useAuth from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'admin';
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export default function ChatPage() {
  const { dictionary, locale } = useDictionary();
  const { profile, isAuthenticated } = useAuth();
  const { showSuccess, showInfo } = useNotifications();
  
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockRooms: ChatRoom[] = [
      {
        id: '1',
        name: 'Фізика - Група А',
        participants: ['teacher1', 'student1', 'student2'],
        unreadCount: 2,
        lastMessage: {
          id: '1',
          senderId: 'teacher1',
          senderName: 'Іван Петрович',
          senderRole: 'teacher',
          message: 'Не забудьте виконати домашнє завдання до завтра',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: 'text'
        }
      },
      {
        id: '2', 
        name: 'Математика - Консультації',
        participants: ['teacher2', 'student1'],
        unreadCount: 0,
        lastMessage: {
          id: '2',
          senderId: 'student1',
          senderName: 'Анна Коваленко',
          senderRole: 'student',
          message: 'Дякую за пояснення!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'text'
        }
      },
      {
        id: '3',
        name: 'Загальні питання',
        participants: ['admin1', 'student1', 'teacher1', 'teacher2'],
        unreadCount: 1,
        lastMessage: {
          id: '3',
          senderId: 'admin1',
          senderName: 'Адміністратор',
          senderRole: 'admin',
          message: 'Оновлення розкладу публікується щоп\'ятниці',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          type: 'system'
        }
      }
    ];

    setChatRooms(mockRooms);
    if (mockRooms.length > 0) {
      setSelectedRoom(mockRooms[0].id);
    }
  }, []);

  // Mock messages for selected room
  useEffect(() => {
    if (selectedRoom) {
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          senderId: 'teacher1',
          senderName: 'Іван Петрович',
          senderRole: 'teacher',
          message: 'Доброго дня! Сьогодні ми розглянемо тему "Закони Ньютона"',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'text'
        },
        {
          id: '2',
          senderId: 'student1',
          senderName: 'Анна Коваленко',
          senderRole: 'student',
          message: 'Доброго дня! У мене є питання щодо другого закону Ньютона',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          type: 'text'
        },
        {
          id: '3',
          senderId: 'teacher1',
          senderName: 'Іван Петрович',
          senderRole: 'teacher',
          message: 'Звичайно! Другий закон Ньютона стверджує, що F = ma. Чи можете конкретизувати ваше питання?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          type: 'text'
        },
        {
          id: '4',
          senderId: 'student1',
          senderName: 'Анна Коваленко',
          senderRole: 'student',
          message: 'Як правильно обчислити силу, якщо відома маса та прискорення?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedRoom]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !profile || !selectedRoom) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: profile.id,
      senderName: profile.first_name || profile.email?.split('@')[0] || 'Користувач',
      senderRole: profile.role as 'student' | 'teacher' | 'admin',
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    showSuccess('Повідомлення надіслано', 'Ваше повідомлення успішно доставлено', 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600';
      case 'teacher':
        return 'text-blue-600';
      case 'student':
      default:
        return 'text-green-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'teacher':
        return '🎓';
      case 'student':
      default:
        return '📚';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сьогодні';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчора';
    } else {
      return date.toLocaleDateString('uk-UA');
    }
  };

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Необхідна авторизація</h2>
          <p className="text-gray-600">Для доступу до чату необхідно увійти в систему</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              💬 Чат та спілкування
            </h1>
            <p className="text-gray-600">
              Спілкуйтеся з викладачами та одногрупниками в режимі реального часу
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Chat Rooms List */}
            <div className="lg:col-span-1">
              <Card className="h-full p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Чати</h3>
                  <Button className="p-2 text-sm">
                    ➕
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedRoom === room.id
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800 truncate">
                          {room.name}
                        </h4>
                        {room.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      {room.lastMessage && (
                        <div className="text-sm text-gray-600">
                          <p className="truncate">
                            <span className={`font-medium ${getRoleColor(room.lastMessage.senderRole)}`}>
                              {getRoleIcon(room.lastMessage.senderRole)} {room.lastMessage.senderName}:
                            </span>
                            {' ' + room.lastMessage.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(room.lastMessage.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-3">
              <Card className="h-full flex flex-col">
                {selectedRoom ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {chatRooms.find(room => room.id === selectedRoom)?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {chatRooms.find(room => room.id === selectedRoom)?.participants.length} учасників
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="secondary" className="p-2">
                            📞
                          </Button>
                          <Button variant="secondary" className="p-2">
                            🎥
                          </Button>
                          <Button variant="secondary" className="p-2">
                            ⚙️
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => {
                        const isOwnMessage = message.senderId === profile.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-blue-500 text-white'
                                : message.type === 'system'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {!isOwnMessage && (
                                <p className={`text-xs font-medium mb-1 ${getRoleColor(message.senderRole)}`}>
                                  {getRoleIcon(message.senderRole)} {message.senderName}
                                </p>
                              )}
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Введіть повідомлення..."
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={1}
                          />
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="px-6"
                        >
                          📤
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-2">
                          <Button variant="secondary" className="p-2 text-sm">
                            📎
                          </Button>
                          <Button variant="secondary" className="p-2 text-sm">
                            😊
                          </Button>
                        </div>
                        
                        {isTyping && (
                          <p className="text-xs text-gray-500">
                            Хтось друкує...
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Оберіть чат для спілкування
                      </h3>
                      <p className="text-gray-600">
                        Виберіть чат зі списку ліворуч, щоб почати спілкування
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
