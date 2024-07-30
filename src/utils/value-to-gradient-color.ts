/**
 * Converts a value within a range into a color string based on a gradient.
 * @param value - The value to be converted to a color.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A color string in hexadecimal format.
 */
export function valueToColor(value: number, min: number, max: number): string {
  if (min === max) {
    return '#ff0000'; // Return red if min and max are equal to avoid division by zero
  }

  // Calculate the percentage
  const perc = ((value - min) / (max - min)) * 100;

  let r: number;
  let g: number;
  const b = 0;

  if (perc < 50) {
    r = 235;
    g = Math.round(5.1 * perc);
  } else {
    g = 225;
    r = Math.round(510 - 5.1 * perc);
  }

  const h = (r << 16) + (g << 8) + b;
  return `#${h.toString(16).padStart(6, '0')}`;
}
