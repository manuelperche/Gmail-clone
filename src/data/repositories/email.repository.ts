import type { IEmailDataSource } from "../../domain/interfaces/email-datasource.interface";
import type { IEmailRepository } from "../../domain/interfaces/email-repository.interface";
import type {
  Thread,
  ThreadGrouping,
  ThreadListItem,
} from "../../domain/models/email.model";

export class EmailRepository implements IEmailRepository {
  private dataSource: IEmailDataSource;

  constructor(dataSource: IEmailDataSource) {
    this.dataSource = dataSource;
  }

  getThreadsByGrouping(grouping: ThreadGrouping): ThreadListItem[] {
    const allThreads = this.dataSource.getAllThreads();

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
        const latestEmail = thread.emails[thread.emails.length - 1];
        const senders = [
          ...new Set(
            thread.emails
              .filter((e) => !e.isDraft && !e.isSent)
              .map((e) => e.from.name)
          ),
        ];
        const hasUnread = thread.emails.some((e) => !e.isRead && !e.isSent);

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

  getThread(threadId: string): Thread | undefined {
    return this.dataSource.getThread(threadId);
  }

  archiveThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedThread = { ...thread, isArchived: true };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  markThreadsAsSpam(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedThread = { ...thread, isSpam: true };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  markThreadsAsNotSpam(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedThread = { ...thread, isSpam: false };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  trashThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedThread = { ...thread, isTrashed: true };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  restoreThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedThread = { ...thread, isTrashed: false };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  deleteThreadsForever(threadIds: string[]): void {
    // In a real implementation, this would actually delete the threads
    // For now, we'll just mark them as deleted (same as trash)
    this.trashThreads(threadIds);
  }

  markThreadsAsRead(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedEmails = thread.emails.map((email) => ({
          ...email,
          isRead: email.isSent ? email.isRead : true,
        }));
        const updatedThread = { ...thread, emails: updatedEmails };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  markThreadsAsUnread(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedEmails = thread.emails.map((email) => ({
          ...email,
          isRead: email.isSent ? email.isRead : false,
        }));
        const updatedThread = { ...thread, emails: updatedEmails };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  markThreadAsRead(threadId: string): void {
    this.markThreadsAsRead([threadId]);
  }

  snoozeThreads(threadIds: string[]): void {
    const snoozedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedThread = {
          ...thread,
          isSnoozed: true,
          snoozedUntil,
        };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  unsnoozeThreads(threadIds: string[]): void {
    threadIds.forEach((id) => {
      const thread = this.dataSource.getThread(id);
      if (thread) {
        const updatedThread = {
          ...thread,
          isSnoozed: false,
          snoozedUntil: undefined,
        };
        this.dataSource.updateThread(updatedThread);
      }
    });
  }

  toggleEmailStar(threadId: string, emailId: string): void {
    const thread = this.dataSource.getThread(threadId);
    if (thread) {
      const updatedEmails = thread.emails.map((email) =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email
      );
      const updatedThread = { ...thread, emails: updatedEmails };
      this.dataSource.updateThread(updatedThread);
    }
  }
}