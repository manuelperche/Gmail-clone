import { create } from 'zustand';
import type { Thread, ThreadGrouping, ThreadListItem } from '../../data/models/email.model';
import { EmailUseCase } from '../usecases/email.usecase';
import { EmailRepository } from '../../data/repositories/email.repository';
import { EmailDataSource } from '../../data/datasources/email.datasource';

interface EmailStore {
  currentGrouping: ThreadGrouping;
  threads: ThreadListItem[];
  selectedThreadIds: Set<string>;
  currentThread: Thread | null;
  emailUseCase: EmailUseCase;
  
  setGrouping: (grouping: ThreadGrouping) => void;
  loadThreads: () => void;
  toggleThreadSelection: (threadId: string) => void;
  selectAllThreads: (select: boolean) => void;
  selectAllInPage: () => void;
  performBulkOperation: (operation: string) => void;
  loadThread: (threadId: string) => void;
  toggleEmailStar: (threadId: string, emailId: string) => void;
  clearSelection: () => void;
}

const dataSource = new EmailDataSource();
const repository = new EmailRepository(dataSource);
const emailUseCase = new EmailUseCase(repository);

export const useEmailStore = create<EmailStore>((set, get) => ({
  currentGrouping: 'inbox',
  threads: [],
  selectedThreadIds: new Set(),
  currentThread: null,
  emailUseCase,

  setGrouping: (grouping) => {
    set({ currentGrouping: grouping, selectedThreadIds: new Set() });
    get().loadThreads();
  },

  loadThreads: () => {
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

  performBulkOperation: (operation) => {
    const { selectedThreadIds } = get();
    const threadIds = Array.from(selectedThreadIds);
    
    if (threadIds.length > 0) {
      emailUseCase.performBulkOperation(threadIds, operation);
      set({ selectedThreadIds: new Set() });
      get().loadThreads();
    }
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