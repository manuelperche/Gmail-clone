export const BulkOperation = {
  ARCHIVE: 'archive',
  UNARCHIVE: 'unarchive',
  SPAM: 'spam',
  TRASH: 'trash',
  MARK_AS_READ: 'markAsRead',
  MARK_AS_UNREAD: 'markAsUnread',
  SNOOZE: 'snooze',
  NOT_SPAM: 'notSpam',
  RESTORE: 'restore',
  DELETE_FOREVER: 'deleteForever',
  UNSNOOZE: 'unsnooze'
} as const;

export type BulkOperation = typeof BulkOperation[keyof typeof BulkOperation];