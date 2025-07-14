import { EmailRepository } from '../../data/repositories/email.repository';
import type { Thread, ThreadGrouping, ThreadListItem } from '../../data/models/email.model';

export class EmailUseCase {
  private repository: EmailRepository;
  constructor(repository: EmailRepository) {
    this.repository = repository;
  }

  getThreadsByGrouping(grouping: ThreadGrouping): ThreadListItem[] {
    return this.repository.getThreadsByGrouping(grouping);
  }

  getThread(threadId: string): Thread | undefined {
    return this.repository.getThread(threadId);
  }

  performBulkOperation(threadIds: string[], operation: string): void {
    switch (operation) {
      case 'archive':
        this.repository.archiveThreads(threadIds);
        break;
      case 'spam':
        this.repository.markAsSpam(threadIds);
        break;
      case 'trash':
        this.repository.moveToTrash(threadIds);
        break;
      case 'markAsRead':
        this.repository.markAsRead(threadIds, true);
        break;
      case 'markAsUnread':
        this.repository.markAsRead(threadIds, false);
        break;
      case 'snooze':
        this.repository.snoozeThreads(threadIds);
        break;
      case 'notSpam':
        this.repository.removeFromSpam(threadIds);
        break;
      case 'restore':
        this.repository.restoreFromTrash(threadIds);
        break;
    }
  }

  toggleEmailStar(threadId: string, emailId: string): void {
    this.repository.toggleStar(threadId, emailId);
  }

  markThreadAsRead(threadId: string): void {
    this.repository.markThreadAsRead(threadId);
  }

  getAvailableOperations(grouping: ThreadGrouping): string[] {
    const baseOperations = ['markAsRead', 'markAsUnread'];
    
    switch (grouping) {
      case 'inbox':
        return ['archive', 'spam', 'trash', ...baseOperations, 'snooze'];
      case 'starred':
        return ['archive', 'spam', 'trash', ...baseOperations, 'snooze'];
      case 'snoozed':
        return ['archive', 'spam', 'trash', ...baseOperations];
      case 'sent':
        return ['archive', 'spam', 'trash', ...baseOperations];
      case 'drafts':
        return ['trash'];
      case 'all':
        return ['archive', 'spam', 'trash', ...baseOperations, 'snooze'];
      case 'spam':
        return ['notSpam', 'trash'];
      case 'trash':
        return ['restore', 'deleteForever'];
      default:
        return [];
    }
  }
}