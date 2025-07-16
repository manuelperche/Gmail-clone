import type { Thread, ThreadGrouping, ThreadListItem } from '../models/email.model';
import type { IEmailRepository } from '../interfaces/email-repository.interface';
import { BulkOperation } from '../enums/bulk-operation.enum';

export class EmailUseCase {
  private repository: IEmailRepository;
  constructor(repository: IEmailRepository) {
    this.repository = repository;
  }

  getThreadsByGrouping(grouping: ThreadGrouping): ThreadListItem[] {
    return this.repository.getThreadsByGrouping(grouping);
  }

  getThread(threadId: string): Thread | undefined {
    return this.repository.getThread(threadId);
  }

  performBulkOperation(threadIds: string[], operation: BulkOperation): void {
    if (threadIds.length === 0) {
      return;
    }

    switch (operation) {
      case BulkOperation.ARCHIVE:
        this.repository.archiveThreads(threadIds);
        break;
      case BulkOperation.SPAM:
        this.repository.markThreadsAsSpam(threadIds);
        break;
      case BulkOperation.TRASH:
        this.repository.trashThreads(threadIds);
        break;
      case BulkOperation.MARK_AS_READ:
        this.repository.markThreadsAsRead(threadIds);
        break;
      case BulkOperation.MARK_AS_UNREAD:
        this.repository.markThreadsAsUnread(threadIds);
        break;
      case BulkOperation.SNOOZE:
        this.repository.snoozeThreads(threadIds);
        break;
      case BulkOperation.NOT_SPAM:
        this.repository.markThreadsAsNotSpam(threadIds);
        break;
      case BulkOperation.RESTORE:
        this.repository.restoreThreads(threadIds);
        break;
      case BulkOperation.DELETE_FOREVER:
        this.repository.deleteThreadsForever(threadIds);
        break;
      case BulkOperation.UNSNOOZE:
        this.repository.unsnoozeThreads(threadIds);
        break;
    }
  }

  toggleEmailStar(threadId: string, emailId: string): void {
    this.repository.toggleEmailStar(threadId, emailId);
  }

  markThreadAsRead(threadId: string): void {
    this.repository.markThreadAsRead(threadId);
  }

  getAvailableOperations(grouping: ThreadGrouping): BulkOperation[] {
    const baseOperations = [BulkOperation.MARK_AS_READ, BulkOperation.MARK_AS_UNREAD];
    
    switch (grouping) {
      case 'inbox':
        return [BulkOperation.ARCHIVE, BulkOperation.SPAM, BulkOperation.TRASH, ...baseOperations, BulkOperation.SNOOZE];
      case 'starred':
        return [BulkOperation.ARCHIVE, BulkOperation.SPAM, BulkOperation.TRASH, ...baseOperations, BulkOperation.SNOOZE];
      case 'snoozed':
        return [BulkOperation.ARCHIVE, BulkOperation.SPAM, BulkOperation.TRASH, ...baseOperations, BulkOperation.UNSNOOZE];
      case 'sent':
        return [BulkOperation.ARCHIVE, BulkOperation.SPAM, BulkOperation.TRASH, ...baseOperations];
      case 'drafts':
        return [BulkOperation.TRASH];
      case 'all':
        return [BulkOperation.ARCHIVE, BulkOperation.SPAM, BulkOperation.TRASH, ...baseOperations, BulkOperation.SNOOZE];
      case 'spam':
        return [BulkOperation.NOT_SPAM, BulkOperation.DELETE_FOREVER];
      case 'trash':
        return [BulkOperation.RESTORE, BulkOperation.DELETE_FOREVER];
      default:
        return [];
    }
  }
}