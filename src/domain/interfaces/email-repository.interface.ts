import type { Thread, ThreadGrouping, ThreadListItem } from "../models/email.model";

export interface IEmailRepository {
  getThreadsByGrouping(grouping: ThreadGrouping): ThreadListItem[];
  getThread(threadId: string): Thread | undefined;
  archiveThreads(threadIds: string[]): void;
  markThreadsAsSpam(threadIds: string[]): void;
  markThreadsAsNotSpam(threadIds: string[]): void;
  trashThreads(threadIds: string[]): void;
  restoreThreads(threadIds: string[]): void;
  deleteThreadsForever(threadIds: string[]): void;
  markThreadsAsRead(threadIds: string[]): void;
  markThreadsAsUnread(threadIds: string[]): void;
  markThreadAsRead(threadId: string): void;
  snoozeThreads(threadIds: string[]): void;
  unsnoozeThreads(threadIds: string[]): void;
  toggleEmailStar(threadId: string, emailId: string): void;
}