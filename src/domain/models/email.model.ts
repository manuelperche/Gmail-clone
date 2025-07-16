export interface Email {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  cc?: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  timestamp: Date;
  isStarred: boolean;
  isRead: boolean;
  isDraft: boolean;
  isSent: boolean;
}

export interface Thread {
  id: string;
  emails: Email[];
  isArchived: boolean;
  isSpam: boolean;
  isTrashed: boolean;
  isSnoozed: boolean;
  snoozedUntil?: Date;
  lastActivityTimestamp: Date;
}

export interface ThreadListItem {
  threadId: string;
  subject: string;
  snippet: string;
  senders: string[];
  hasUnread: boolean;
  isStarred: boolean;
  emailCount: number;
  lastActivityTimestamp: Date;
}

export type ThreadGrouping = 'inbox' | 'starred' | 'snoozed' | 'sent' | 'drafts' | 'all' | 'spam' | 'trash';