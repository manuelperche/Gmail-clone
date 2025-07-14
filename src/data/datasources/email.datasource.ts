import type { Email, Thread } from '../models/email.model';

export class EmailDataSource {
  private threads: Map<string, Thread> = new Map();
  private currentUser = { name: 'John Doe', email: 'john.doe@company.com' };
  private frozenTime = new Date('2030-03-14T15:14:00');

  constructor() {
    this.generateMockData();
  }

  private generateMockData(): void {
    const mockThreads: Thread[] = [];
    
    // Regular email threads
    for (let i = 1; i <= 30; i++) {
      const threadId = `thread-${i}`;
      const emailCount = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 2 : 1;
      const emails: Email[] = [];
      
      for (let j = 0; j < emailCount; j++) {
        const isFromMe = Math.random() > 0.5;
        const timestamp = new Date(this.frozenTime.getTime() - (i * 24 * 60 * 60 * 1000) - (j * 60 * 60 * 1000));
        
        emails.push({
          id: `email-${threadId}-${j}`,
          threadId,
          from: isFromMe ? this.currentUser : {
            name: `Contact ${i}`,
            email: `contact${i}@example.com`
          },
          to: isFromMe ? [{
            name: `Contact ${i}`,
            email: `contact${i}@example.com`
          }] : [this.currentUser],
          subject: `Project Update ${i}`,
          body: `This is the body of email ${j + 1} in thread ${i}. It contains important information about the project status and next steps.`,
          timestamp,
          isStarred: Math.random() > 0.8,
          isRead: Math.random() > 0.3 || isFromMe,
          isDraft: false,
          isSent: isFromMe
        });
      }
      
      mockThreads.push({
        id: threadId,
        emails,
        isArchived: false,
        isSpam: false,
        isTrashed: false,
        isSnoozed: false,
        lastActivityTimestamp: emails[emails.length - 1].timestamp
      });
    }
    
    // Draft emails
    for (let i = 1; i <= 10; i++) {
      const threadId = `draft-${i}`;
      const timestamp = new Date(this.frozenTime.getTime() - (i * 12 * 60 * 60 * 1000));
      
      const draftEmail: Email = {
        id: `email-${threadId}-0`,
        threadId,
        from: this.currentUser,
        to: [{
          name: `Recipient ${i}`,
          email: `recipient${i}@example.com`
        }],
        subject: `Draft: Proposal ${i}`,
        body: `This is a draft email about proposal ${i}. Still working on finalizing the details...`,
        timestamp,
        isStarred: false,
        isRead: true,
        isDraft: true,
        isSent: false
      };
      
      mockThreads.push({
        id: threadId,
        emails: [draftEmail],
        isArchived: false,
        isSpam: false,
        isTrashed: false,
        isSnoozed: false,
        lastActivityTimestamp: timestamp
      });
    }
    
    // Spam emails
    for (let i = 1; i <= 5; i++) {
      const threadId = `spam-${i}`;
      const timestamp = new Date(this.frozenTime.getTime() - (i * 48 * 60 * 60 * 1000));
      
      const spamEmail: Email = {
        id: `email-${threadId}-0`,
        threadId,
        from: {
          name: `Spammer ${i}`,
          email: `spam${i}@suspicious.com`
        },
        to: [this.currentUser],
        subject: `URGENT: You've won $1,000,000!!!`,
        body: `Congratulations! You've been selected as our lucky winner. Click here to claim your prize...`,
        timestamp,
        isStarred: false,
        isRead: false,
        isDraft: false,
        isSent: false
      };
      
      mockThreads.push({
        id: threadId,
        emails: [spamEmail],
        isArchived: false,
        isSpam: true,
        isTrashed: false,
        isSnoozed: false,
        lastActivityTimestamp: timestamp
      });
    }
    
    // Snoozed emails
    for (let i = 1; i <= 5; i++) {
      const threadId = `snoozed-${i}`;
      const timestamp = new Date(this.frozenTime.getTime() - (i * 24 * 60 * 60 * 1000));
      const snoozedUntil = new Date(this.frozenTime.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      const snoozedEmail: Email = {
        id: `email-${threadId}-0`,
        threadId,
        from: {
          name: `Manager ${i}`,
          email: `manager${i}@company.com`
        },
        to: [this.currentUser],
        subject: `Action Required: Review Document ${i}`,
        body: `Please review the attached document and provide your feedback by end of week.`,
        timestamp,
        isStarred: true,
        isRead: true,
        isDraft: false,
        isSent: false
      };
      
      mockThreads.push({
        id: threadId,
        emails: [snoozedEmail],
        isArchived: false,
        isSpam: false,
        isTrashed: false,
        isSnoozed: true,
        snoozedUntil,
        lastActivityTimestamp: timestamp
      });
    }
    
    // Store all threads
    mockThreads.forEach(thread => {
      this.threads.set(thread.id, thread);
    });
  }

  getAllThreads(): Thread[] {
    return Array.from(this.threads.values());
  }

  getThread(threadId: string): Thread | undefined {
    return this.threads.get(threadId);
  }

  updateThread(threadId: string, updates: Partial<Thread>): void {
    const thread = this.threads.get(threadId);
    if (thread) {
      this.threads.set(threadId, { ...thread, ...updates });
    }
  }

  updateEmail(threadId: string, emailId: string, updates: Partial<Email>): void {
    const thread = this.threads.get(threadId);
    if (thread) {
      const emailIndex = thread.emails.findIndex(e => e.id === emailId);
      if (emailIndex !== -1) {
        thread.emails[emailIndex] = { ...thread.emails[emailIndex], ...updates };
      }
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getFrozenTime() {
    return this.frozenTime;
  }
}