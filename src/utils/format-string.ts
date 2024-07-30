export const capitalize = (str: string) => {
  if (!str || str.charAt(0) === str.charAt(0).toUpperCase()) {
    return str; // Return the string as is if it's empty or already capitalized
  }

  // Capitalize the first character and concatenate the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatUserName = (string: string) => {
  if (string.includes(' ')) {
    const words = string.split(' ');
    const firstLetters = `${words[1].at(0)}.`;
    return `${words[0]} ${firstLetters}`;
  }

  return string;
};

export const formatUserNameOneLetter = (string: string) => {
  if (string.includes(' ')) {
    const words = string.split(' ');
    const firstLetters = `${words[0].at(0)}${words[1].at(0)}`;
    return firstLetters;
  }

  return string[0].at(0);
};

export const kebabToSnake = (input: string): string => {
  return input.replace(/-/g, '_');
};

export const snakeToKebab = (input: string): string => {
  return input.replace(/_/g, '-');
};

export const spaceToKebab = (input: string): string => {
  return input.replace(/ /g, '-');
};

export const spaceToSnake = (input: string): string => {
  return input.replace(/ /g, '_');
};

export const extractSmartdataName = (pathname: string): string => {
  const smartDataString = pathname.split('/smartdata/')[1];
  return kebabToSnake(smartDataString);
};

export const capitalizeEachWord = (str: string) => {
  if (!str) {
    return str; // Return the string as is if it's empty
  }

  const words = str.split(' ');
  const capitalizedWords = words.map((word) => capitalize(word));
  return capitalizedWords.join(' ');
};

export const numberWithSpaces = (x: number | string | null | undefined) => {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0';
};

export const formatStringWithoutIndex = (input: string): string => {
  if (!input) {
    return '';
  }

  // Remplace les tirets bas (_) par des espaces
  let formattedString = input.replace(/_/g, ' ');

  // Supprime "index" de la fin de la chaîne si présent
  if (formattedString.endsWith(' index')) {
    formattedString = formattedString.substring(0, formattedString.lastIndexOf(' index'));
  }

  return capitalize(formattedString);
};
