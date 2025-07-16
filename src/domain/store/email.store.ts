import { create } from 'zustand';
import type { Thread, ThreadGrouping, ThreadListItem } from '../models/email.model';
import { EmailUseCase } from '../usecases/email.usecase';
import { BulkOperation } from '../enums/bulk-operation.enum';
import { DIContainer } from '../di/container';

interface EmailStore {
  currentGrouping: ThreadGrouping;
  threads: ThreadListItem[];
  selectedThreadIds: Set<string>;
  currentThread: Thread | null;
  emailUseCase: EmailUseCase;
  isLoading: boolean;
  
  setGrouping: (grouping: ThreadGrouping) => void;
  loadThreads: () => Promise<void>;
  toggleThreadSelection: (threadId: string) => void;
  selectAllThreads: (select: boolean) => void;
  selectAllInPage: () => void;
  performBulkOperation: (operation: BulkOperation) => void;
  loadThread: (threadId: string) => void;
  toggleEmailStar: (threadId: string, emailId: string) => void;
  clearSelection: () => void;
}

const container = DIContainer.getInstance();
const emailUseCase = container.getEmailUseCase();

export const useEmailStore = create<EmailStore>((set, get) => ({
  currentGrouping: 'inbox',
  threads: [],
  selectedThreadIds: new Set(),
  currentThread: null,
  emailUseCase,
  isLoading: false,

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

  performBulkOperation: (operation) => {
    const { selectedThreadIds } = get();
    const threadIds = Array.from(selectedThreadIds);
    
    emailUseCase.performBulkOperation(threadIds, operation);
    set({ selectedThreadIds: new Set() });
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

  clearSelection: () => {
    set({ selectedThreadIds: new Set() });
  }
}));