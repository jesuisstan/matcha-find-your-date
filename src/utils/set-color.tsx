export function setColor(value: number, unit: string): string {
  if (unit === 'yty' || unit === 'mtm' || unit === 'qtq') {
    if (value > 0) {
      return 'text-green-500';
    } else if (value < 0) {
      return 'text-red-500';
    } else {
      return 'text-stone-600';
    }
  } else {
    return 'text-stone-600';
  }
}
