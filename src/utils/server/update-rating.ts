/**
 * Update the user's rating if at least one day has passed since their last action.
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

  // If more than 1 day has passed and the raiting is less than the max limit
  if (timeDifference >= oneDayInMilliseconds && currentRaiting < maxRaiting) {
    return currentRaiting + 1;
  }

  // Return the original raiting if conditions aren't met
  return currentRaiting;
}
