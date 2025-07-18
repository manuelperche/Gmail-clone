import { useParams } from 'react-router-dom';
import { ChevronLeft, Archive, AlertTriangle, Trash2, Mail, MailOpen, Clock, CheckCircle, RotateCcw, X, Star, MoreVertical } from 'lucide-react';
import type { ThreadGrouping } from '../../../domain/models/email.model';
import { useThreadDetailViewModel } from '../../viewmodels/thread-detail.viewmodel';
import { Tooltip } from '../components/Tooltip';

export const ThreadDetailPage = () => {
  const { threadId, grouping } = useParams<{ threadId: string; grouping: ThreadGrouping }>();
  
  const {
    thread,
    availableOperations,
    handleOperation,
    toggleEmailStar,
    formatDateTime,
    goBack
  } = useThreadDetailViewModel(threadId!, grouping as ThreadGrouping);

  if (!thread) {
    return <div className="p-4">Loading...</div>;
  }

  const operationLabels: Record<string, string> = {
    archive: 'Archive',
    spam: 'Report spam',
    trash: 'Delete',
    markAsRead: 'Mark as read',
    markAsUnread: 'Mark as unread',
    snooze: 'Snooze',
    notSpam: 'Not spam',
    restore: 'Move to Inbox',
    deleteForever: 'Delete forever',
    unsnooze: 'Unsnooze'
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'archive': return Archive;
      case 'spam': return AlertTriangle;
      case 'trash': return Trash2;
      case 'markAsRead': return MailOpen;
      case 'markAsUnread': return Mail;
      case 'snooze': return Clock;
      case 'notSpam': return CheckCircle;
      case 'restore': return RotateCcw;
      case 'deleteForever': return X;
      case 'unsnooze': return Clock;
      default: return Mail;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center h-12 px-6 border-b border-[#e8eaed]">
        <Tooltip content="Back to list">
          <button
            onClick={goBack}
            className="p-2 mr-4 hover:bg-[#f1f3f4] rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-[#5f6368]" />
          </button>
        </Tooltip>
        
        <div className="flex items-center space-x-2">
          {availableOperations.map(op => {
            const IconComponent = getOperationIcon(op);
            return (
              <Tooltip key={op} content={operationLabels[op] || op}>
                <button
                  onClick={() => handleOperation(op)}
                  className="flex items-center p-2 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
                >
                  <IconComponent size={20} />
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-[#f6f8fc]">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center mb-8">
            <h1 className="text-xl font-normal text-[#202124] flex-1">{thread.emails[0].subject}</h1>
            {thread.isSnoozed && (
              <Tooltip content="Snoozed">
                <div className="flex items-center text-[#5f6368]">
                  <Clock size={20} className="mr-2" />
                  {thread.snoozedUntil && (
                    <span className="text-sm">
                      Until {thread.snoozedUntil.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Tooltip>
            )}
          </div>
          
          <div className="space-y-3">
            {thread.emails.map((email) => (
              <div key={email.id} className="bg-white rounded-lg border border-[#e8eaed] shadow-sm">
                <div className="flex items-start justify-between p-6 pb-4">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1a73e8] rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                        {email.from.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-[#202124]">{email.from.name}</div>
                        <div className="text-sm text-[#5f6368]">
                          to {email.to.map(t => t.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-[#5f6368]">
                      {formatDateTime(email.timestamp)}
                    </span>
                    <button
                      onClick={() => toggleEmailStar(thread.id, email.id)}
                      className="p-1 hover:bg-[#f1f3f4] rounded transition-colors"
                    >
                      <Star 
                        size={20}
                        className={`${email.isStarred ? 'text-[#fbbc04] fill-current' : 'text-[#5f6368]'}`}
                      />
                    </button>
                    <button className="p-1 hover:bg-[#f1f3f4] rounded transition-colors">
                      <MoreVertical size={20} className="text-[#5f6368]" />
                    </button>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="text-[#202124] whitespace-pre-wrap leading-relaxed">
                    {email.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};