export type TSelectorOption = {
  value: string;
  label: string;
};

/**
 * Converts a list of tags into an array of TSelectorOption objects.
 * @param tagsList - Array of tags in string format.
 * @returns Array of TSelectorOption objects with translated labels.
 * @translate Function to translate the tag labels.
 */
export function createTagsOptions(
  tagsList: string[],
  translate: (key: string) => string
): TSelectorOption[] {
  return tagsList.map((tag) => ({
    value: tag,
    label: translate(`tags.${tag}`),
  }));
}
