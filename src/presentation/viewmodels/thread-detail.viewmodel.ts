import { useEmailViewModel } from './email.viewmodel';
import type { ThreadGrouping } from '../../domain/models/email.model';
import { BulkOperation } from '../../domain/enums/bulk-operation.enum';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useThreadDetailViewModel = (threadId: string, grouping: ThreadGrouping) => {
  const {
    currentThread,
    loadThread,
    toggleEmailStar,
    performSingleThreadOperation,
    getAvailableOperations
  } = useEmailViewModel();

  const navigate = useNavigate();

  useEffect(() => {
    loadThread(threadId);
  }, [threadId, loadThread]);

  const availableOperations = getAvailableOperations();

  const handleOperation = (operation: BulkOperation) => {
    console.log('handleOperation', operation, 'threadId:', threadId);
    performSingleThreadOperation(threadId, operation);
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