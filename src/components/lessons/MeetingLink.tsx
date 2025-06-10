'use client';

import React from 'react';
import { useDictionary } from '@/lib/useDictionary';
import Button from '../ui/Button';

interface MeetingLinkProps {
  meetingLink?: string;
  title?: string;
}

const MeetingLink: React.FC<MeetingLinkProps> = ({ meetingLink, title }) => {
  const { dictionary } = useDictionary();
  
  if (!meetingLink) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {dictionary.lessons.no_meeting_link}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-4">
      <h3 className="text-lg font-medium mb-2">
        {title || dictionary.lessons.online_lesson}
      </h3>
      <p className="mb-4 text-gray-600">
        {dictionary.lessons.join_meeting_description}
      </p>      <a 
        href={meetingLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center inline-flex transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />        </svg>
        {dictionary.lessons.join_meeting}
      </a>
    </div>
  );
}

export default MeetingLink;
