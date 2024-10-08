/**
 * Update the user's rating on login.
 *
 * @param lastActionDate - The last time the user performed an action (as a string)
 * @param currentRaiting - The user's current rating
 * @param maxRaiting - The maximum allowable rating (default 100)
 * @param currentDate - The current date (optional, defaults to new Date())
 * @returns The updated rating
 */
export function updateUserRaitingForLogin(
  lastActionDate: string,
  currentRaiting: number,
  maxRaiting = 100,
  currentDate?: Date
): number {
  const now = currentDate || new Date(); // Use provided currentDate or default to new Date()
  const lastAction = new Date(lastActionDate);
  const timeDifference = now.getTime() - lastAction.getTime();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const halfDayInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours

  // If the last action was within the same calendar day or within 12 hours, no change in rating
  if (timeDifference < halfDayInMilliseconds) {
    return currentRaiting;
  }

  // If the last action was performed more than 12 hours ago but less than 24 hours ago, add 1 point
  if (timeDifference >= halfDayInMilliseconds && timeDifference < oneDayInMilliseconds) {
    return Math.min(currentRaiting + 1, maxRaiting);
  }

  // If more than 1 day has passed, calculate how many full days have passed and subtract points
  const daysPassed = Math.floor(timeDifference / oneDayInMilliseconds);

  // Decrease rating by the number of days passed, ensuring it doesn't go below 0
  return Math.max(currentRaiting - daysPassed, 0);
}
