import React from 'react';
import type { Story } from '../../types/social';

interface StoriesProps {
  stories: Story[];
}

const Stories: React.FC<StoriesProps> = ({ stories }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Stories</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 w-20 text-center">
            <div className={`w-16 h-16 mx-auto rounded-full border-2 ${
              story.isViewed ? 'border-gray-300' : 'border-blue-500'
            } bg-gray-200 mb-1`}></div>
            <p className="text-xs text-gray-600 truncate">{story.user.displayName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;