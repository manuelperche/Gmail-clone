import type { Thread, ThreadGrouping, ThreadListItem } from '../../domain/models/email.model';
import { MockDataGenerator } from '../generators/mock-data.generator';
import { InMemoryEmailStore } from '../stores/in-memory-email.store';

export class EmailService {
  private emailStore: InMemoryEmailStore;
  private currentUser = { name: 'John Doe', email: 'john.doe@company.com' };

  constructor() {
    const generator = new MockDataGenerator();
    const mockThreads = generator.generateMockThreads();
    this.emailStore = new InMemoryEmailStore(mockThreads);
  }

  getAllThreads(): Thread[] {
    return this.emailStore.getAllThreads();
  }

  getThread(threadId: string): Thread | undefined {
    return this.emailStore.getThread(threadId);
  }

  updateThread(thread: Thread): void {
    this.emailStore.updateThread(thread);
  }

  getCurrentUser(): string {
    return this.currentUser.email;
  }

  getThreadsByGrouping(grouping: ThreadGrouping): ThreadListItem[] {
    const allThreads = this.getAllThreads();

    const filteredThreads = allThreads.filter((thread) => {
      switch (grouping) {
        case "inbox": {
          // A thread should be in inbox if it has at least one email
          // that was sent TO the user (not a draft, not only sent by the user)
          const hasIncomingEmail = thread.emails.some((e) => 
            !e.isDraft && !e.isSent
          );
          
          return (
            !thread.isArchived &&
            !thread.isSpam &&
            !thread.isTrashed &&
            !thread.isSnoozed &&
            hasIncomingEmail
          );
        }
        case "starred":
          return thread.emails.some((e) => e.isStarred) && !thread.isTrashed;
        case "snoozed":
          return thread.isSnoozed && !thread.isTrashed;
        case "sent":
          return (
            thread.emails.some((e) => e.isSent && !e.isDraft) &&
            !thread.isTrashed
          );
        case "drafts":
          return thread.emails.some((e) => e.isDraft) && !thread.isTrashed;
        case "all":
          return !thread.isSpam && !thread.isTrashed;
        case "spam":
          return thread.isSpam && !thread.isTrashed;
        case "trash":
          return thread.isTrashed;
        default:
          return false;
      }
    });

    return filteredThreads
      .map((thread) => {
        const latestEmail = thread.emails[thread.emails.length - 1];
        const senders = [
          ...new Set(
            thread.emails
              .filter((e) => !e.isDraft && !e.isSent)
              .map((e) => e.from.name)
          ),
        ];
        const hasUnread = thread.emails.some((e) => !e.isRead);

        return {
          threadId: thread.id,
          subject: latestEmail.subject,
          snippet: latestEmail.body.substring(0, 100) + "...",
          senders: senders.length > 0 ? senders : [latestEmail.from.name],
          hasUnread,
          isStarred: thread.emails.some((e) => e.isStarred),
          emailCount: thread.emails.length,
          lastActivityTimestamp: thread.lastActivityTimestamp,
        };
      })
      .sort(
        (a, b) =>
          b.lastActivityTimestamp.getTime() - a.lastActivityTimestamp.getTime()
      );
  }

  archiveThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({ ...thread, isArchived: true });
      }
    });
  }

  unarchiveThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({ ...thread, isArchived: false });
      }
    });
  }

  markThreadsAsSpam(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({ ...thread, isSpam: true });
      }
    });
  }

  markThreadsAsNotSpam(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({ ...thread, isSpam: false });
      }
    });
  }

  trashThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({ ...thread, isTrashed: true });
      }
    });
  }

  restoreThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({ ...thread, isTrashed: false });
      }
    });
  }

  deleteThreadsForever(threadIds: string[]): void {
    threadIds.forEach((id) => {
      this.emailStore.deleteThread(id);
    });
  }

  markThreadsAsRead(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        const updatedEmails = thread.emails.map((email) => ({
          ...email,
          isRead: true,
        }));
        this.updateThread({ ...thread, emails: updatedEmails });
      }
    });
  }

  markThreadsAsUnread(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        const updatedEmails = thread.emails.map((email) => ({
          ...email,
          isRead: false,
        }));
        this.updateThread({ ...thread, emails: updatedEmails });
      }
    });
  }

  markThreadAsRead(threadId: string): void {
    this.markThreadsAsRead([threadId]);
  }

  snoozeThreads(threadIds: string[]): void {
    const snoozedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({
          ...thread,
          isSnoozed: true,
          snoozedUntil,
        });
      }
    });
  }

  unsnoozeThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.getThread(id);
      if (thread) {
        this.updateThread({
          ...thread,
          isSnoozed: false,
          snoozedUntil: undefined,
        });
      }
    });
  }

  toggleEmailStar(threadId: string, emailId: string): void {
    const thread = this.getThread(threadId);
    if (thread) {
      const updatedEmails = thread.emails.map((email) =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email
      );
      this.updateThread({ ...thread, emails: updatedEmails });
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();