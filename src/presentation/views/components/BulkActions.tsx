import { Archive, AlertTriangle, Trash2, Mail, MailOpen, Clock, CheckCircle, RotateCcw, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  operations: string[];
  onOperation: (operation: string) => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onSelectAll: () => void;
  totalThreads: number;
}

export const BulkActions = ({
  selectedCount,
  operations,
  onOperation,
  isAllSelected,
  isPartiallySelected,
  onSelectAll,
  totalThreads
}: BulkActionsProps) => {
  const operationLabels: Record<string, string> = {
    archive: 'Archive',
    spam: 'Report spam',
    trash: 'Delete',
    markAsRead: 'Mark as read',
    markAsUnread: 'Mark as unread',
    snooze: 'Snooze',
    notSpam: 'Not spam',
    restore: 'Move to Inbox',
    deleteForever: 'Delete forever'
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'archive': return Archive;
      case 'spam': return AlertTriangle;
      case 'trash': return Trash2;
      case 'markAsRead': return MailOpen;
      case 'markAsUnread': return Mail;
      case 'snooze': return Clock;
      case 'notSpam': return CheckCircle;
      case 'restore': return RotateCcw;
      case 'deleteForever': return X;
      default: return Mail;
    }
  };

  return (
    <div className="flex items-center h-12 px-6 bg-white border-b border-[#e8eaed]">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={input => {
            if (input) {
              input.indeterminate = isPartiallySelected;
            }
          }}
          onChange={onSelectAll}
          className="w-4 h-4 text-blue-600 rounded-sm"
          style={{ accentColor: '#1a73e8' }}
        />
        {selectedCount > 0 && (
          <div className="ml-2 relative">
            <select 
              className="appearance-none bg-transparent pr-4 text-sm focus:outline-none cursor-pointer hover:bg-[#f1f3f4] rounded px-2 py-1 text-[#5f6368]"
              onChange={(e) => {
                if (e.target.value === 'all') {
                  onSelectAll();
                }
                e.target.value = '';
              }}
            >
              <option value="">▼</option>
              <option value="all">All {totalThreads}</option>
            </select>
          </div>
        )}
      </div>
      
      {selectedCount > 0 && (
        <div className="flex items-center ml-6 space-x-2">
          {operations.map(op => {
            const IconComponent = getOperationIcon(op);
            return (
              <button
                key={op}
                onClick={() => onOperation(op)}
                className="flex items-center p-2 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
                title={operationLabels[op] || op}
              >
                <IconComponent size={20} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};