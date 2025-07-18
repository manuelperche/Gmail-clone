import type { Email, Thread } from "../../domain/models/email.model";
import { getFrozenTime } from "../../utils/time";

export class MockDataGenerator {
  generateMockThreads(): Thread[] {
    const threads: Thread[] = [];
    const baseTime = getFrozenTime();

    // Generate regular email threads
    for (let i = 1; i <= 30; i++) {
      const threadId = `thread-${i}`;
      const emailCount = Math.floor(Math.random() * 5) + 1;
      const emails: Email[] = [];

      for (let j = 1; j <= emailCount; j++) {
        const emailId = `email-${i}-${j}`;
        const timestamp = new Date(baseTime.getTime() - (i * 60 * 60 * 1000) - (j * 15 * 60 * 1000));
        
        emails.push({
          id: emailId,
          threadId,
          from: {
            name: this.getRandomName(),
            email: this.getRandomEmail(),
          },
          to: [{
            name: "You",
            email: "you@example.com",
          }],
          subject: this.getRandomSubject(),
          body: this.getRandomBody(),
          timestamp,
          isStarred: Math.random() > 0.8,
          isRead: j < emailCount || Math.random() > 0.3,
          isDraft: false,
          isSent: false,
        });
      }

      threads.push({
        id: threadId,
        emails,
        isArchived: Math.random() > 0.9, // 10% of regular emails are archived
        isSpam: false,
        isTrashed: false,
        isSnoozed: false,
        lastActivityTimestamp: emails[emails.length - 1].timestamp,
      });
    }

    // Generate draft emails
    for (let i = 1; i <= 10; i++) {
      const threadId = `draft-${i}`;
      const timestamp = new Date(baseTime.getTime() - (i * 30 * 60 * 1000));
      
      threads.push({
        id: threadId,
        emails: [{
          id: `draft-email-${i}`,
          threadId,
          from: {
            name: "You",
            email: "you@example.com",
          },
          to: [{
            name: this.getRandomName(),
            email: this.getRandomEmail(),
          }],
          subject: `Draft: ${this.getRandomSubject()}`,
          body: this.getRandomBody(),
          timestamp,
          isStarred: false,
          isRead: true,
          isDraft: true,
          isSent: false,
        }],
        isArchived: false,
        isSpam: false,
        isTrashed: false,
        isSnoozed: false,
        lastActivityTimestamp: timestamp,
      });
    }

    // Generate spam emails
    for (let i = 1; i <= 5; i++) {
      const threadId = `spam-${i}`;
      const timestamp = new Date(baseTime.getTime() - (i * 12 * 60 * 60 * 1000));
      
      threads.push({
        id: threadId,
        emails: [{
          id: `spam-email-${i}`,
          threadId,
          from: {
            name: "Spam Sender",
            email: "spam@example.com",
          },
          to: [{
            name: "You",
            email: "you@example.com",
          }],
          subject: "🎉 URGENT: You've won a million dollars!",
          body: "Click here to claim your prize...",
          timestamp,
          isStarred: false,
          isRead: false,
          isDraft: false,
          isSent: false,
        }],
        isArchived: false,
        isSpam: true,
        isTrashed: false,
        isSnoozed: false,
        lastActivityTimestamp: timestamp,
      });
    }

    // Generate snoozed emails
    for (let i = 1; i <= 5; i++) {
      const threadId = `snoozed-${i}`;
      const timestamp = new Date(baseTime.getTime() - (i * 6 * 60 * 60 * 1000));
      const snoozeUntil = new Date(baseTime.getTime() + (i * 24 * 60 * 60 * 1000));
      
      threads.push({
        id: threadId,
        emails: [{
          id: `snoozed-email-${i}`,
          threadId,
          from: {
            name: this.getRandomName(),
            email: this.getRandomEmail(),
          },
          to: [{
            name: "You",
            email: "you@example.com",
          }],
          subject: `Snoozed: ${this.getRandomSubject()}`,
          body: this.getRandomBody(),
          timestamp,
          isStarred: false,
          isRead: true,
          isDraft: false,
          isSent: false,
        }],
        isArchived: false,
        isSpam: false,
        isTrashed: false,
        isSnoozed: true,
        snoozedUntil: snoozeUntil,
        lastActivityTimestamp: timestamp,
      });
    }

    // Generate sent emails and threads
    for (let i = 1; i <= 10; i++) {
      const threadId = `sent-${i}`;
      const emailCount = Math.floor(Math.random() * 3) + 1; // 1-3 emails per thread
      const emails: Email[] = [];

      for (let j = 1; j <= emailCount; j++) {
        const emailId = `sent-email-${i}-${j}`;
        const timestamp = new Date(baseTime.getTime() - (i * 45 * 60 * 1000) - (j * 10 * 60 * 1000));
        
        // Alternate between sent and received emails in conversation
        const isSentEmail = j % 2 === 1; // First, third, etc. are sent by you
        
        emails.push({
          id: emailId,
          threadId,
          from: isSentEmail ? {
            name: "You",
            email: "you@example.com",
          } : {
            name: this.getRandomName(),
            email: this.getRandomEmail(),
          },
          to: isSentEmail ? [{
            name: this.getRandomName(),
            email: this.getRandomEmail(),
          }] : [{
            name: "You", 
            email: "you@example.com",
          }],
          subject: `Re: ${this.getRandomSubject()}`,
          body: isSentEmail ? this.getRandomSentBody() : this.getRandomBody(),
          timestamp,
          isStarred: Math.random() > 0.9,
          isRead: true, // Sent emails are always "read"
          isDraft: false,
          isSent: isSentEmail,
        });
      }

      threads.push({
        id: threadId,
        emails,
        isArchived: Math.random() > 0.9, // 10% of sent emails are archived
        isSpam: false,
        isTrashed: false,
        isSnoozed: false,
        lastActivityTimestamp: emails[emails.length - 1].timestamp,
      });
    }

    return threads;
  }

  private getRandomName(): string {
    const names = [
      "John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson",
      "Diana Davis", "Eve Taylor", "Frank Miller", "Grace Anderson", "Henry Thomas"
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  private getRandomEmail(): string {
    const domains = ["gmail.com", "yahoo.com", "hotmail.com", "example.com"];
    const name = this.getRandomName().toLowerCase().replace(" ", ".");
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name}@${domain}`;
  }

  private getRandomSubject(): string {
    const subjects = [
      "Meeting Request for Next Week",
      "Project Update and Next Steps",
      "Quick Question About the Report",
      "Lunch Plans for Tomorrow",
      "Important: Please Review",
      "Welcome to Our Team!",
      "Monthly Newsletter",
      "System Maintenance Notice",
      "Invoice #12345",
      "Thank You for Your Order"
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  private getRandomBody(): string {
    const bodies = [
      "Hi there,\n\nI hope this email finds you well. I wanted to reach out regarding...",
      "Dear team,\n\nI'm writing to update you on the current status of our project...",
      "Hello!\n\nI have a quick question about the report you sent yesterday...",
      "Good morning,\n\nWould you be available for lunch tomorrow? I'd love to catch up...",
      "Hi,\n\nThis is an important message that requires your immediate attention...",
    ];
    return bodies[Math.floor(Math.random() * bodies.length)];
  }

  private getRandomSentBody(): string {
    const sentBodies = [
      "Hi,\n\nThanks for your email. I wanted to follow up on what we discussed...",
      "Hello,\n\nI'm reaching out to share some updates on the project we've been working on...",
      "Good afternoon,\n\nI hope you're doing well. I wanted to check in about...",
      "Hi there,\n\nThanks for getting back to me so quickly. Regarding your question...",
      "Hello,\n\nI'm writing to confirm our meeting for next week. Please let me know if...",
      "Hi,\n\nI wanted to share the document we discussed. Please review it and let me know...",
    ];
    return sentBodies[Math.floor(Math.random() * sentBodies.length)];
  }
}