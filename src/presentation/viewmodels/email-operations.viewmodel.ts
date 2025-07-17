import { useEmailViewModel } from './email.viewmodel';

export const useEmailOperations = () => {
  const {
    currentGrouping,
    performBulkOperation,
    performSingleThreadOperation,
    toggleEmailStar,
    toggleThreadStar,
    loadThread,
    getAvailableOperations
  } = useEmailViewModel();

  const availableOperations = getAvailableOperations();

  return {
    currentGrouping,
    availableOperations,
    performBulkOperation,
    performSingleThreadOperation,
    toggleEmailStar,
    toggleThreadStar,
    loadThread
  };
};