import { Star } from 'lucide-react';
import type { ThreadListItem } from '../../../domain/models/email.model';

interface ThreadListItemProps {
  thread: ThreadListItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClick: () => void;
  formatDate: (date: Date) => string;
}

export const ThreadListItemComponent = ({ 
  thread, 
  isSelected, 
  onToggleSelect, 
  onClick,
  formatDate 
}: ThreadListItemProps) => {
  return (
    <div 
      className={`flex items-center group hover:shadow-sm border-b border-[#f0f0f0] cursor-pointer transition-all ${
        isSelected ? 'bg-[#c2dbff]' : thread.hasUnread ? 'bg-white' : 'bg-white'
      } hover:shadow-md`}
      onClick={onClick}
    >
      <div className="flex items-center px-4 py-0.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 text-blue-600 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ accentColor: '#1a73e8' }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div className="w-5 mr-4">
        <button 
          className={`p-1 hover:bg-[#f1f3f4] rounded transition-colors ${thread.isStarred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          onClick={(e) => {
            e.stopPropagation();
            // Handle star toggle
          }}
        >
          <Star 
            size={20} 
            className={`${thread.isStarred ? 'text-[#fbbc04] fill-current' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="flex-1 min-w-0 pr-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-6 min-w-0">
            <div className="flex items-center text-sm">
              <span className={`${thread.hasUnread ? 'font-medium text-[#202124]' : 'text-[#5f6368]'} truncate mr-2`}>
                {thread.senders.join(', ')}
              </span>
              {thread.emailCount > 1 && (
                <span className="text-[#5f6368] text-xs">({thread.emailCount})</span>
              )}
            </div>
            <div className="flex items-baseline text-sm mt-0.5">
              <span className={`${thread.hasUnread ? 'font-medium text-[#202124]' : 'text-[#5f6368]'} mr-2`}>
                {thread.subject}
              </span>
              <span className="text-[#5f6368] text-sm truncate">
                - {thread.snippet}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`text-xs ${thread.hasUnread ? 'font-medium text-[#202124]' : 'text-[#5f6368]'} whitespace-nowrap`}>
              {formatDate(thread.lastActivityTimestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};