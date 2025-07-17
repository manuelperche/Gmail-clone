import { useEmailViewModel } from './email.viewmodel';
import { useEmailSelection } from './email-selection.viewmodel';
import { useEmailOperations } from './email-operations.viewmodel';
import { formatDate } from '../../utils/date';

// Hook for thread list functionality
export const useThreadListViewModel = () => {
  const {
    threads,
    currentGrouping,
    isLoading,
    setGrouping,
    loadThreads
  } = useEmailViewModel();

  const {
    selectedThreadIds,
    isAllSelected,
    isPartiallySelected,
    handleSelectAll,
    toggleThreadSelection,
    selectByFilter
  } = useEmailSelection();

  const {
    availableOperations,
    performBulkOperation,
    toggleThreadStar
  } = useEmailOperations();

  return {
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
    toggleThreadStar,
    selectByFilter,
    performBulkOperation,
    formatDate
  };
};