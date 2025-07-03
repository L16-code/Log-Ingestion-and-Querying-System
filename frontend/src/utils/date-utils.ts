import { format, formatDistanceToNow, parseISO } from 'date-fns';

type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'iso' | 'relative';

const formatMap = {
  short: 'MM/dd/yyyy',
  medium: 'MMM d, yyyy h:mm a',
  long: 'MMMM d, yyyy h:mm:ss a',
  full: 'EEEE, MMMM d, yyyy h:mm:ss a',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export const formatDate = (
  date: Date | string | number | undefined | null,
  dateFormat: DateFormat | string = 'medium',
  options?: {
    includeTime?: boolean;
    timeZone?: string;
  }
): string => {
  if (!date) return 'N/A';
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  // Handle invalid dates
  if (Number.isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  try {
    if (dateFormat === 'relative') {
      return formatDistanceToNow(dateObj, { addSuffix: true });
    }

    const formatString = formatMap[dateFormat as keyof typeof formatMap] || dateFormat;
    let formattedDate = format(dateObj, formatString);
    
    // Handle timezone if provided
    if (options?.timeZone) {
      const timeZoneFormatted = dateObj.toLocaleString('en-US', {
        timeZone: options.timeZone,
        timeZoneName: 'short',
      });
      formattedDate = `${formattedDate} (${timeZoneFormatted.split(' ').pop()})`;
    }
    
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date format';
  }
};

export const formatTimestamp = (timestamp: number | string): string => {
  return formatDate(timestamp, 'medium');
};

export const formatTimeAgo = (date: Date | string | number): string => {
  return formatDate(date, 'relative');
};

export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};

export const parseDateString = (dateString: string): Date => {
  return parseISO(dateString);
};
