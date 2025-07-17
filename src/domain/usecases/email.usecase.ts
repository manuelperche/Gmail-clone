import type { Thread, ThreadGrouping, ThreadListItem } from '../models/email.model';
import { BulkOperation } from '../enums/bulk-operation.enum';
import { emailService } from '../../data/services/email.service';

export class EmailUseCase {
  private emailService = emailService;

  getThreadsByGrouping(grouping: ThreadGrouping): ThreadListItem[] {
    return this.emailService.getThreadsByGrouping(grouping);
  }

  getThread(threadId: string): Thread | undefined {
    return this.emailService.getThread(threadId);
  }

  performBulkOperation(threadIds: string[], operation: BulkOperation): void {
    if (threadIds.length === 0) {
      return;
    }

    switch (operation) {
      case BulkOperation.ARCHIVE:
        this.emailService.archiveThreads(threadIds);
        break;
      case BulkOperation.UNARCHIVE:
        this.emailService.unarchiveThreads(threadIds);
        break;
      case BulkOperation.SPAM:
        this.emailService.markThreadsAsSpam(threadIds);
        break;
      case BulkOperation.TRASH:
        this.emailService.trashThreads(threadIds);
        break;
      case BulkOperation.MARK_AS_READ:
        this.emailService.markThreadsAsRead(threadIds);
        break;
      case BulkOperation.MARK_AS_UNREAD:
        this.emailService.markThreadsAsUnread(threadIds);
        break;
      case BulkOperation.SNOOZE:
        this.emailService.snoozeThreads(threadIds);
        break;
      case BulkOperation.NOT_SPAM:
        this.emailService.markThreadsAsNotSpam(threadIds);
        break;
      case BulkOperation.RESTORE:
        this.emailService.restoreThreads(threadIds);
        break;
      case BulkOperation.DELETE_FOREVER:
        this.emailService.deleteThreadsForever(threadIds);
        break;
      case BulkOperation.UNSNOOZE:
        this.emailService.unsnoozeThreads(threadIds);
        break;
    }
  }

  toggleEmailStar(threadId: string, emailId: string): void {
    this.emailService.toggleEmailStar(threadId, emailId);
  }

  markThreadAsRead(threadId: string): void {
    this.emailService.markThreadAsRead(threadId);
  }

  toggleThreadStar(threadId: string): void {
    const thread = this.emailService.getThread(threadId);
    if (thread && thread.emails.length > 0) {
      // Check if thread is currently starred (any email is starred)
      const isCurrentlyStarred = thread.emails.some(e => e.isStarred);
      
      // If currently starred, unstar all emails; if not starred, star the first email
      if (isCurrentlyStarred) {
        // Unstar all emails in the thread
        thread.emails.forEach(email => {
          if (email.isStarred) {
            this.emailService.toggleEmailStar(threadId, email.id);
          }
        });
      } else {
        // Star the first email
        this.emailService.toggleEmailStar(threadId, thread.emails[0].id);
      }
    }
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
        return [BulkOperation.ARCHIVE, BulkOperation.UNARCHIVE, BulkOperation.SPAM, BulkOperation.TRASH, ...baseOperations, BulkOperation.SNOOZE];
      case 'spam':
        return [BulkOperation.NOT_SPAM, BulkOperation.DELETE_FOREVER];
      case 'trash':
        return [BulkOperation.RESTORE, BulkOperation.DELETE_FOREVER];
      default:
        return [];
    }
  }
}

// Export singleton instance
export const emailUseCase = new EmailUseCase();