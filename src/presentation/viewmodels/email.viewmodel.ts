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
  refreshThreads: () => void;
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
}

export const useEmailViewModel = create<EmailViewModelState>((set, get) => ({
  // Initial state
  currentGrouping: 'inbox',
  threads: [],
  selectedThreadIds: new Set(),
  currentThread: null,
  isLoading: false,

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

  refreshThreads: () => {
    // Refresh threads without loading state
    const threads = emailUseCase.getThreadsByGrouping(get().currentGrouping);
    set({ threads });
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
    // Refresh without loading state
    get().refreshThreads();
  },

  performSingleThreadOperation: (threadId: string, operation: BulkOperation) => {
    console.log('performSingleThreadOperation', threadId, operation);
    emailUseCase.performBulkOperation([threadId], operation);
    // Refresh without loading state
    get().refreshThreads();
  },

  loadThread: (threadId) => {
    const thread = emailUseCase.getThread(threadId);
    if (thread) {
      emailUseCase.markThreadAsRead(threadId);
      set({ currentThread: thread });
      get().refreshThreads();
    }
  },

  toggleEmailStar: (threadId, emailId) => {
    emailUseCase.toggleEmailStar(threadId, emailId);
    const thread = emailUseCase.getThread(threadId);
    if (thread) {
      set({ currentThread: thread });
      get().refreshThreads();
    }
  },

  toggleThreadStar: (threadId) => {
    emailUseCase.toggleThreadStar(threadId);
    get().refreshThreads();
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
  }
}));

// Initialize with inbox data on app start
setTimeout(() => {
  useEmailViewModel.getState().refreshThreads();
}, 0);

