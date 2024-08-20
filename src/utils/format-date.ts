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

  const formattedDate = inputDate.toLocaleString('en-US', options);

  // Remove commas from the formatted date -> ex: "Sep 15 2022 12:30 GMT+2"
  return formattedDate.replace(/,/g, '');
};

export const formatApiDateTableHistory = (apiDate: string): string => {
  if (!apiDate) return 'Invalid Date';

  const inputDate = new Date(apiDate);

  // Extract year, month, and day from the date
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(inputDate.getDate()).padStart(2, '0');

  // Construct the formatted date string in 'YYYY-MM-DD' format
  return `${year}-${month}-${day}`;
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
