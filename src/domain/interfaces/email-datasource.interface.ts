import type { Thread } from "../models/email.model";

export interface IEmailDataSource {
  getAllThreads(): Thread[];
  getThread(threadId: string): Thread | undefined;
  updateThread(thread: Thread): void;
  getCurrentUser(): string;
}