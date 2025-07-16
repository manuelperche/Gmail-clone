import type { Thread } from "../../domain/models/email.model";

export class InMemoryEmailStore {
  private threads: Map<string, Thread> = new Map();

  constructor(initialThreads: Thread[]) {
    this.initializeThreads(initialThreads);
  }

  private initializeThreads(threads: Thread[]): void {
    threads.forEach(thread => {
      this.threads.set(thread.id, thread);
    });
  }

  getAllThreads(): Thread[] {
    return Array.from(this.threads.values());
  }

  getThread(threadId: string): Thread | undefined {
    return this.threads.get(threadId);
  }

  updateThread(thread: Thread): void {
    this.threads.set(thread.id, { ...thread });
  }

  deleteThread(threadId: string): void {
    this.threads.delete(threadId);
  }

  clear(): void {
    this.threads.clear();
  }

  size(): number {
    return this.threads.size;
  }
}