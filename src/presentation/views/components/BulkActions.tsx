import { BulkOperation } from '../../../domain/enums/bulk-operation.enum';
import { getOperationIcon } from '../../../utils/operation-icons';

interface BulkActionsProps {
  selectedCount: number;
  operations: BulkOperation[];
  onOperation: (operation: BulkOperation) => void;
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