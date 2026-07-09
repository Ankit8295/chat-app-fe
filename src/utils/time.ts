/**
 * Formats a date/time value for display in chat lists
 * - Shows time (HH:MM) if less than 24 hours ago
 * - Shows day name (Mon, Tue, etc.) if less than 7 days ago
 * - Shows date (Jan 15) if older than 7 days
 */
export function formatTime(timeValue: string | Date): string {
  const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue;
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  // If less than 24 hours, show time
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  // If less than 7 days, show day name
  if (diffInHours < 168) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Otherwise show date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
