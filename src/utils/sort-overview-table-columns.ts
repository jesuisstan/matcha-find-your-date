export const sortColumnsForTableOverview = (setUnits: Set<string>): string[] => {
  const unitsArray = Array.from(setUnits);
  const sortedUnits: string[] = [];

  // Find and add item with any name
  const anyNameIndex = unitsArray.findIndex(
    (unit) => unit !== 'mtm' && unit !== 'yty' && unit !== 't'
  );
  if (anyNameIndex !== -1) {
    sortedUnits.push(unitsArray[anyNameIndex]);
    unitsArray.splice(anyNameIndex, 1);
  }

  // Add 'mtm' if exists
  const mtmIndex = unitsArray.indexOf('mtm');
  if (mtmIndex !== -1) {
    sortedUnits.push(unitsArray[mtmIndex]);
    unitsArray.splice(mtmIndex, 1);
  }

  // Add 'yty' if exists
  const ytyIndex = unitsArray.indexOf('yty');
  if (ytyIndex !== -1) {
    sortedUnits.push(unitsArray[ytyIndex]);
    unitsArray.splice(ytyIndex, 1);
  }

  // Add 't_ha' if exists
  const tHaIndex = unitsArray.indexOf('t_ha');
  if (tHaIndex !== -1) {
    sortedUnits.push(unitsArray[tHaIndex]);
    unitsArray.splice(tHaIndex, 1);
  }

  // Add the rest of the units if any
  sortedUnits.push(...unitsArray);

  return sortedUnits;
};
