export const formatApiDateLastUpdate = (apiDate: string | undefined): string => {
  if (!apiDate) return 'Invalid Date';

  const inputDate = new Date(apiDate);

  // Format the date using options
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // Use 24-hour format
    timeZoneName: 'short',
  };

  // Use the browser's default locale
  const formattedDate = inputDate.toLocaleString(undefined, options);

  // Optionally, remove commas from the formatted date
  return formattedDate.replace(/,/g, '');
};

/**
 * Converts an ISO 8601 date string to the "YYYY-MM-DD" format.
 * If the input is invalid or empty, it returns an empty string.
 *
 * @param isoDate - The ISO 8601 date string (e.g., "1987-07-31T22:00:00.000Z").
 * @returns The formatted date string in "YYYY-MM-DD" format, or an empty string if the input is invalid.
 */
export function formatDateForInput(isoDate: string | undefined | null): string {
  if (!isoDate) return '';

  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ''; // Check if the date is invalid
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Invalid date format:', isoDate);
    return '';
  }
}
