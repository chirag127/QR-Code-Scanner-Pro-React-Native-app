/**
 * Format a timestamp into a human-readable date string
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get yesterday's date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if the date is today
  if (date >= today) {
    return `Today, ${formatTime(date)}`;
  }
  
  // Check if the date is yesterday
  if (date >= yesterday) {
    return `Yesterday, ${formatTime(date)}`;
  }
  
  // Otherwise, return the full date
  return `${date.toLocaleDateString()} ${formatTime(date)}`;
};

/**
 * Format a Date object into a time string (HH:MM AM/PM)
 * @param date Date object
 * @returns Formatted time string
 */
const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be displayed as 12
  
  // Add leading zero to minutes if needed
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
};

/**
 * Truncate text to a specified length and add ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
};
