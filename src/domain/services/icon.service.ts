import {
  Archive,
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
import { BulkOperation } from "../enums/bulk-operation.enum";

export class IconService {
  private static readonly operationIconMap: Record<BulkOperation, LucideIcon> = {
    [BulkOperation.ARCHIVE]: Archive,
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

  static getOperationIcon(operation: BulkOperation): LucideIcon {
    return this.operationIconMap[operation];
  }

  static getAllOperationIcons(): Record<BulkOperation, LucideIcon> {
    return { ...this.operationIconMap };
  }
}