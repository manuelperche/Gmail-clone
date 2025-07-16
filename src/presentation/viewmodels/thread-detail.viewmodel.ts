import { useEmailStore } from '../../domain/store/email.store';
import type { ThreadGrouping } from '../../domain/models/email.model';
import { BulkOperation } from '../../domain/enums/bulk-operation.enum';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useThreadDetailViewModel = (threadId: string, grouping: ThreadGrouping) => {
  const {
    currentThread,
    emailUseCase,
    loadThread,
    toggleEmailStar,
    performBulkOperation
  } = useEmailStore();

  const navigate = useNavigate();

  useEffect(() => {
    loadThread(threadId);
  }, [threadId, loadThread]);

  const availableOperations = emailUseCase.getAvailableOperations(grouping);

  const handleOperation = (operation: BulkOperation) => {
    performBulkOperation(operation);
    navigate(`/${grouping}`);
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const goBack = () => {
    navigate(`/${grouping}`);
  };

  return {
    thread: currentThread,
    availableOperations,
    handleOperation,
    toggleEmailStar,
    formatDateTime,
    goBack
  };
};