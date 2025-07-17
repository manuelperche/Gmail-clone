import {
  Archive,
  ArchiveRestore,
  AlertTriangle,
  Trash2,
  MailCheck,
  MailX,
  Clock,
  ShieldCheck,
  RotateCcw,
  X,
  type LucideIcon,
} from "lucide-react";
import { BulkOperation } from "../domain/enums/bulk-operation.enum";

export const OPERATION_ICONS: Record<BulkOperation, LucideIcon> = {
  [BulkOperation.ARCHIVE]: Archive,
  [BulkOperation.UNARCHIVE]: ArchiveRestore,
  [BulkOperation.SPAM]: AlertTriangle,
  [BulkOperation.TRASH]: Trash2,
  [BulkOperation.MARK_AS_READ]: MailCheck,
  [BulkOperation.MARK_AS_UNREAD]: MailX,
  [BulkOperation.SNOOZE]: Clock,
  [BulkOperation.NOT_SPAM]: ShieldCheck,
  [BulkOperation.RESTORE]: RotateCcw,
  [BulkOperation.DELETE_FOREVER]: X,
  [BulkOperation.UNSNOOZE]: Clock,
};

export const getOperationIcon = (operation: BulkOperation): LucideIcon => {
  return OPERATION_ICONS[operation];
};