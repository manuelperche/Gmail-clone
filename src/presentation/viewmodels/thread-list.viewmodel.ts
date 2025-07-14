import { useEmailStore } from '../../domain/store/email.store';
import type { ThreadGrouping } from '../../data/models/email.model';
import { useEffect } from 'react';

export const useThreadListViewModel = (grouping: ThreadGrouping) => {
  const {   
    threads,
    selectedThreadIds,
    currentGrouping,
    emailUseCase,
    setGrouping,
    loadThreads,
    toggleThreadSelection,
    selectAllThreads,
    performBulkOperation,
    clearSelection
  } = useEmailStore();

  useEffect(() => {
    if (currentGrouping !== grouping) {
      setGrouping(grouping);
    } else {
      loadThreads();
    }
  }, [grouping, currentGrouping, setGrouping, loadThreads]);

  const isAllSelected = threads.length > 0 && 
    threads.every(thread => selectedThreadIds.has(thread.threadId));
  
  const isPartiallySelected = !isAllSelected && 
    threads.some(thread => selectedThreadIds.has(thread.threadId));

  const availableOperations = emailUseCase.getAvailableOperations(grouping);

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllThreads(true);
    }
  };

  const formatDate = (date: Date): string => {
    const frozenTime = new Date('2030-03-14T15:14:00');
    const diff = frozenTime.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return {
    threads,
    selectedThreadIds,
    isAllSelected,
    isPartiallySelected,
    availableOperations,
    handleSelectAll,
    toggleThreadSelection,
    performBulkOperation,
    formatDate
  };
};