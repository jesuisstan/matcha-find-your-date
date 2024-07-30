// round number to a given precision
export function roundNumber(number: number | string, precision: number) {
  if (!Number.isNaN(number) && number !== undefined && number !== null) {
    const factor = Math.pow(10, precision);
    return Math.round(Number(number) * factor) / factor;
  } else {
    return 0;
  }
}
