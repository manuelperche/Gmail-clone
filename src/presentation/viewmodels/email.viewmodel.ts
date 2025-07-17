import { create } from 'zustand';
import type { Thread, ThreadGrouping, ThreadListItem } from '../../domain/models/email.model';
import { BulkOperation } from '../../domain/enums/bulk-operation.enum';
import { emailUseCase } from '../../domain/usecases/email.usecase';

interface EmailViewModelState {
  // Current state
  currentGrouping: ThreadGrouping;
  threads: ThreadListItem[];
  selectedThreadIds: Set<string>;
  currentThread: Thread | null;
  isLoading: boolean;
  
  // Actions
  setGrouping: (grouping: ThreadGrouping) => void;
  loadThreads: () => Promise<void>;
  toggleThreadSelection: (threadId: string) => void;
  selectAllThreads: (select: boolean) => void;
  selectAllInPage: () => void;
  selectByFilter: (filter: 'all' | 'none' | 'read' | 'unread' | 'starred' | 'unstarred') => void;
  performBulkOperation: (operation: BulkOperation) => void;
  performSingleThreadOperation: (threadId: string, operation: BulkOperation) => void;
  loadThread: (threadId: string) => void;
  toggleEmailStar: (threadId: string, emailId: string) => void;
  toggleThreadStar: (threadId: string) => void;
  clearSelection: () => void;
  
  // Computed properties
  getIsAllSelected: () => boolean;
  getIsPartiallySelected: () => boolean;
  getAvailableOperations: () => BulkOperation[];
  formatDate: (date: Date) => string;
}

export const useEmailViewModel = create<EmailViewModelState>((set, get) => ({
  // Initial state
  currentGrouping: 'inbox',
  threads: [],
  selectedThreadIds: new Set(),
  currentThread: null,
  isLoading: true,

  // Actions
  setGrouping: (grouping) => {
    set({ 
      currentGrouping: grouping, 
      selectedThreadIds: new Set(),
      threads: [], // Clear old data immediately
      isLoading: true // Show loading state
    });
    get().loadThreads();
  },

  loadThreads: async () => {
    set({ isLoading: true });
    
    // Simulate realistic loading time (like an API call)
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const threads = emailUseCase.getThreadsByGrouping(get().currentGrouping);
    set({ threads, isLoading: false });
  },

  toggleThreadSelection: (threadId) => {
    set((state) => {
      const newSelection = new Set(state.selectedThreadIds);
      if (newSelection.has(threadId)) {
        newSelection.delete(threadId);
      } else {
        newSelection.add(threadId);
      }
      return { selectedThreadIds: newSelection };
    });
  },

  selectAllThreads: (select) => {
    set((state) => {
      if (select) {
        const allThreadIds = new Set(state.threads.map(t => t.threadId));
        return { selectedThreadIds: allThreadIds };
      } else {
        return { selectedThreadIds: new Set() };
      }
    });
  },

  selectAllInPage: () => {
    set((state) => {
      const pageThreadIds = new Set(state.threads.map(t => t.threadId));
      return { selectedThreadIds: pageThreadIds };
    });
  },

  selectByFilter: (filter) => {
    set((state) => {
      let filteredIds: string[] = [];
      
      switch (filter) {
        case 'all':
          filteredIds = state.threads.map(t => t.threadId);
          break;
        case 'none':
          filteredIds = [];
          break;
        case 'read':
          filteredIds = state.threads.filter(t => !t.hasUnread).map(t => t.threadId);
          break;
        case 'unread':
          filteredIds = state.threads.filter(t => t.hasUnread).map(t => t.threadId);
          break;
        case 'starred':
          filteredIds = state.threads.filter(t => t.isStarred).map(t => t.threadId);
          break;
        case 'unstarred':
          filteredIds = state.threads.filter(t => !t.isStarred).map(t => t.threadId);
          break;
      }
      
      return { selectedThreadIds: new Set(filteredIds) };
    });
  },

  performBulkOperation: (operation) => {
    console.log('performBulkOperation', operation);
    const { selectedThreadIds } = get();
    const threadIds = Array.from(selectedThreadIds);
    
    emailUseCase.performBulkOperation(threadIds, operation);
    set({ selectedThreadIds: new Set() });
    // Fire-and-forget async reload
    get().loadThreads();
  },

  performSingleThreadOperation: (threadId: string, operation: BulkOperation) => {
    console.log('performSingleThreadOperation', threadId, operation);
    emailUseCase.performBulkOperation([threadId], operation);
    // Fire-and-forget async reload
    get().loadThreads();
  },

  loadThread: (threadId) => {
    const thread = emailUseCase.getThread(threadId);
    if (thread) {
      emailUseCase.markThreadAsRead(threadId);
      set({ currentThread: thread });
      get().loadThreads();
    }
  },

  toggleEmailStar: (threadId, emailId) => {
    emailUseCase.toggleEmailStar(threadId, emailId);
    const thread = emailUseCase.getThread(threadId);
    if (thread) {
      set({ currentThread: thread });
      get().loadThreads();
    }
  },

  toggleThreadStar: (threadId) => {
    const thread = emailUseCase.getThread(threadId);
    if (thread && thread.emails.length > 0) {
      // Reuse the existing toggleEmailStar method
      get().toggleEmailStar(threadId, thread.emails[0].id);
    }
  },

  clearSelection: () => {
    set({ selectedThreadIds: new Set() });
  },

  // Computed properties
  getIsAllSelected: () => {
    const { threads, selectedThreadIds } = get();
    return threads.length > 0 && 
      threads.every(thread => selectedThreadIds.has(thread.threadId));
  },

  getIsPartiallySelected: () => {
    const { threads, selectedThreadIds } = get();
    const isAllSelected = get().getIsAllSelected();
    return !isAllSelected && 
      threads.some(thread => selectedThreadIds.has(thread.threadId));
  },

  getAvailableOperations: () => {
    const { currentGrouping } = get();
    return emailUseCase.getAvailableOperations(currentGrouping);
  },

  formatDate: (date: Date) => {
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
  }
}));

// Initialize with inbox data on app start
setTimeout(() => {
  useEmailViewModel.getState().loadThreads();
}, 0);

// Hook for thread list functionality
export const useThreadListViewModel = () => {
  const {
    threads,
    selectedThreadIds,
    currentGrouping,
    isLoading,
    setGrouping,
    loadThreads,
    toggleThreadSelection,
    selectAllThreads,
    selectByFilter,
    performBulkOperation,
    toggleThreadStar,
    clearSelection,
    getIsAllSelected,
    getIsPartiallySelected,
    getAvailableOperations,
    formatDate
  } = useEmailViewModel();

  const isAllSelected = getIsAllSelected();
  const isPartiallySelected = getIsPartiallySelected();
  const availableOperations = getAvailableOperations();

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllThreads(true);
    }
  };

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