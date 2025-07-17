import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { BulkOperation } from '../../../domain/enums/bulk-operation.enum';
import { getOperationIcon } from '../../../utils/operation-icons';
import { Tooltip } from './Tooltip';

interface BulkActionsProps {
  selectedCount: number;
  operations: BulkOperation[];
  onOperation: (operation: BulkOperation) => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onSelectAll: () => void;
  onSelectByFilter: (filter: 'all' | 'none' | 'read' | 'unread' | 'starred' | 'unstarred') => void;
  totalThreads: number;
}

export const BulkActions = ({
  selectedCount,
  operations,
  onOperation,
  isAllSelected,
  isPartiallySelected,
  onSelectAll,
  onSelectByFilter
}: BulkActionsProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const operationLabels: Record<BulkOperation, string> = {
    [BulkOperation.ARCHIVE]: 'Archive',
    [BulkOperation.SPAM]: 'Report spam',
    [BulkOperation.TRASH]: 'Delete',
    [BulkOperation.MARK_AS_READ]: 'Mark as read',
    [BulkOperation.MARK_AS_UNREAD]: 'Mark as unread',
    [BulkOperation.SNOOZE]: 'Snooze',
    [BulkOperation.NOT_SPAM]: 'Not spam',
    [BulkOperation.RESTORE]: 'Move to Inbox',
    [BulkOperation.DELETE_FOREVER]: 'Delete forever',
    [BulkOperation.UNSNOOZE]: 'Unsnooze',
  };


  return (
    <div className="flex items-center h-12 px-6 bg-white border-b border-[#e8eaed]">
      <div className="flex items-center relative" ref={dropdownRef}>
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
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="ml-1 p-1 hover:bg-[#f1f3f4] rounded transition-colors"
        >
          <ChevronDown size={16} className="text-[#5f6368]" />
        </button>
        
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-[#e8eaed] py-1 z-50 min-w-[140px]">
            <button
              onClick={() => {
                onSelectByFilter('all');
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#f1f3f4]"
            >
              All
            </button>
            <button
              onClick={() => {
                onSelectByFilter('none');
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#f1f3f4]"
            >
              None
            </button>
            <div className="border-t border-[#e8eaed] my-1"></div>
            <button
              onClick={() => {
                onSelectByFilter('read');
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#f1f3f4]"
            >
              Read
            </button>
            <button
              onClick={() => {
                onSelectByFilter('unread');
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#f1f3f4]"
            >
              Unread
            </button>
            <button
              onClick={() => {
                onSelectByFilter('starred');
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#f1f3f4]"
            >
              Starred
            </button>
            <button
              onClick={() => {
                onSelectByFilter('unstarred');
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[#202124] hover:bg-[#f1f3f4]"
            >
              Unstarred
            </button>
          </div>
        )}
      </div>
      
      {selectedCount > 0 && (
        <div className="flex items-center ml-6 space-x-2">
          {operations.map(op => {
            const IconComponent = getOperationIcon(op);
            return (
              <Tooltip key={op} content={operationLabels[op] || op}>
                <button
                  onClick={() => onOperation(op)}
                  className="flex items-center p-2 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
                >
                  <IconComponent size={20} />
                </button>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
};