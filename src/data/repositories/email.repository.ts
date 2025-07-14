import { EmailDataSource } from "../datasources/email.datasource";
import type {
  Thread,
  ThreadGrouping,
  ThreadListItem,
} from "../models/email.model";

export class EmailRepository {
  private dataSource: EmailDataSource;

  constructor(dataSource: EmailDataSource) {
    this.dataSource = dataSource;
  }

  getThreadsByGrouping(grouping: ThreadGrouping): ThreadListItem[] {
    const allThreads = this.dataSource.getAllThreads();
    const currentUser = this.dataSource.getCurrentUser();

    const filteredThreads = allThreads.filter((thread) => {
      switch (grouping) {
        case "inbox":
          return (
            !thread.isArchived &&
            !thread.isSpam &&
            !thread.isTrashed &&
            !thread.isSnoozed &&
            !thread.emails.every((e) => e.isDraft)
          );
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
        const lastEmail = thread.emails[thread.emails.length - 1];
        const senders = thread.emails
          .filter((e) => e.from.email !== currentUser.email)
          .map((e) => e.from.name);
        const uniqueSenders = [...new Set(senders)];

        return {
          threadId: thread.id,
          subject: thread.emails[0].subject,
          snippet: lastEmail.body.substring(0, 100) + "...",
          senders:
            uniqueSenders.length > 0 ? uniqueSenders : [currentUser.name],
          hasUnread: thread.emails.some((e) => !e.isRead && !e.isSent),
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

  getThread(threadId: string): Thread | undefined {
    return this.dataSource.getThread(threadId);
  }

  archiveThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      this.dataSource.updateThread(id, { isArchived: true });
    });
  }

  markAsSpam(threadIds: string[]): void {
    threadIds.forEach((id) => {
      this.dataSource.updateThread(id, { isSpam: true });
    });
  }

  moveToTrash(threadIds: string[]): void {
    threadIds.forEach((id) => {
      this.dataSource.updateThread(id, { isTrashed: true });
    });
  }

  markAsRead(threadIds: string[], read: boolean): void {
    threadIds.forEach((threadId) => {
      const thread = this.dataSource.getThread(threadId);
      if (thread) {
        thread.emails.forEach((email) => {
          if (!email.isSent) {
            this.dataSource.updateEmail(threadId, email.id, { isRead: read });
          }
        });
      }
    });
  }

  snoozeThreads(threadIds: string[]): void {
    const snoozedUntil = new Date(
      this.dataSource.getFrozenTime().getTime() + 7 * 24 * 60 * 60 * 1000
    );
    threadIds.forEach((id) => {
      this.dataSource.updateThread(id, { isSnoozed: true, snoozedUntil });
    });
  }

  toggleStar(threadId: string, emailId: string): void {
    const thread = this.dataSource.getThread(threadId);
    if (thread) {
      const email = thread.emails.find((e) => e.id === emailId);
      if (email) {
        this.dataSource.updateEmail(threadId, emailId, {
          isStarred: !email.isStarred,
        });
      }
    }
  }

  markThreadAsRead(threadId: string): void {
    const thread = this.dataSource.getThread(threadId);
    if (thread) {
      thread.emails.forEach((email) => {
        if (!email.isSent && !email.isRead) {
          this.dataSource.updateEmail(threadId, email.id, { isRead: true });
        }
      });
    }
  }

  removeFromSpam(threadIds: string[]): void {
    threadIds.forEach((id) => {
      this.dataSource.updateThread(id, { isSpam: false });
    });
  }

  restoreFromTrash(threadIds: string[]): void {
    threadIds.forEach((id) => {
      this.dataSource.updateThread(id, { isTrashed: false });
    });
  }
}
