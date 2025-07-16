import type { Thread } from '../../domain/models/email.model';
import type { IEmailDataSource } from '../../domain/interfaces/email-datasource.interface';
import type { ITimeService } from '../../domain/interfaces/time-service.interface';
import { MockDataGenerator } from '../generators/mock-data.generator';
import { InMemoryEmailStore } from '../stores/in-memory-email.store';

export class EmailDataSource implements IEmailDataSource {
  private emailStore: InMemoryEmailStore;
  private currentUser = { name: 'John Doe', email: 'john.doe@company.com' };
  constructor(timeService: ITimeService) {
    const generator = new MockDataGenerator(timeService);
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
}