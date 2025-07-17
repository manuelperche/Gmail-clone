import { useEmailViewModel } from './email.viewmodel';

export const useEmailSelection = () => {
  const {
    selectedThreadIds,
    toggleThreadSelection,
    selectAllThreads,
    selectByFilter,
    clearSelection,
    getIsAllSelected,
    getIsPartiallySelected
  } = useEmailViewModel();

  const isAllSelected = getIsAllSelected();
  const isPartiallySelected = getIsPartiallySelected();

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllThreads(true);
    }
  };

  return {
    selectedThreadIds,
    isAllSelected,
    isPartiallySelected,
    handleSelectAll,
    toggleThreadSelection,
    selectByFilter,
    clearSelection
  };
};