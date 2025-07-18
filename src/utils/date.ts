import { getFrozenTime } from './time';

export const formatDate = (date: Date): string => {
  const frozenTime = new Date('2030-03-14T15:14:00');
  const diff = frozenTime.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export const formatGmailStyle = (date: Date): string => {
  const now = getFrozenTime();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Format the date part
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Format the time part
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Format the "ago" part
  let agoStr = '';
  if (diffInMinutes < 1) {
    agoStr = '0 minutes ago';
  } else if (diffInMinutes < 60) {
    agoStr = `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    agoStr = `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    agoStr = `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  return `${dateStr}, ${timeStr} (${agoStr})`;
};