import { Settings } from 'lucide-react';
import type { ThreadGrouping } from '../../../domain/models/email.model';

interface PageHeaderProps {
  grouping: ThreadGrouping;
  threadCount: number;
}

export const PageHeader = ({ grouping, threadCount }: PageHeaderProps) => {
  const getGroupingTitle = (grouping: ThreadGrouping): string => {
    switch (grouping) {
      case 'inbox': return 'Inbox';
      case 'starred': return 'Starred';
      case 'snoozed': return 'Snoozed';
      case 'sent': return 'Sent';
      case 'drafts': return 'Drafts';
      case 'all': return 'All Mail';
      case 'spam': return 'Spam';
      case 'trash': return 'Trash';
      default: return 'Gmail';
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-2 border-b border-[#e8eaed] bg-white">
      <h1 className="text-xl font-normal text-[#202124]">
        {getGroupingTitle(grouping)} {threadCount > 0 && <span className="text-[#5f6368] text-sm">({threadCount})</span>}
      </h1>
      <div className="flex items-center space-x-1">
        <button className="p-2 hover:bg-[#f1f3f4] rounded-full transition-colors">
          <Settings size={20} className="text-[#5f6368]" />
        </button>
      </div>
    </div>
  );
};