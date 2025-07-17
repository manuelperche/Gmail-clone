import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { ThreadGrouping } from '../../../domain/models/email.model';
import { useThreadListViewModel } from '../../viewmodels/email.viewmodel';
import { ThreadListItemComponent } from '../components/ThreadListItem';
import { BulkActions } from '../components/BulkActions';
import { PageHeader } from '../components/PageHeader';
import { ThreadListSkeleton } from '../components/ThreadListSkeleton';

export const ThreadListPage = () => {
  const { grouping } = useParams<{ grouping: ThreadGrouping }>();
  const navigate = useNavigate();
  
  const {
    threads,
    selectedThreadIds,
    isAllSelected,
    isPartiallySelected,
    availableOperations,
    isLoading,
    currentGrouping,
    setGrouping,
    loadThreads,
    handleSelectAll,
    toggleThreadSelection,
    performBulkOperation,
    formatDate
  } = useThreadListViewModel();

  useEffect(() => {
    if (grouping && currentGrouping !== grouping) {
      setGrouping(grouping as ThreadGrouping);
    }
  }, [grouping, currentGrouping, setGrouping]);

  useEffect(() => {
    if (grouping && currentGrouping === grouping) {
      loadThreads();
    }
  }, [grouping, currentGrouping, loadThreads]);

  const handleThreadClick = (threadId: string) => {
    navigate(`/${grouping}/thread/${threadId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader grouping={grouping as ThreadGrouping} threadCount={threads.length} />
      
      <BulkActions
        selectedCount={selectedThreadIds.size}
        operations={availableOperations}
        onOperation={performBulkOperation}
        isAllSelected={isAllSelected}
        isPartiallySelected={isPartiallySelected}
        onSelectAll={handleSelectAll}
        totalThreads={threads.length}
      />
      
      <div className="flex-1 overflow-auto bg-white">
        {isLoading ? (
          <ThreadListSkeleton />
        ) : threads.length === 0 ? (
          <div className="text-center py-20 text-[#5f6368]">
            <div className="text-6xl mb-4">📭</div>
            <div className="text-lg">No conversations in {grouping}</div>
          </div>
        ) : (
          threads.map(thread => (
            <ThreadListItemComponent
              key={thread.threadId}
              thread={thread}
              isSelected={selectedThreadIds.has(thread.threadId)}
              onToggleSelect={() => toggleThreadSelection(thread.threadId)}
              onClick={() => handleThreadClick(thread.threadId)}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
};