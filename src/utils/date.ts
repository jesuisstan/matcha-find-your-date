import dayjs from 'dayjs';

export function getCurrentDay(format: string) {
  return dayjs().format(format);
}

export function formatDataSimple(data: any) {
  const dateObject = new Date(data);
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  return `1996/${month}/${day}`;
}

export function formatDate(date: string, commodity: string, country: string) {
  const dateObject = new Date(date);

  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');

  if (
    commodity === 'wheat' &&
    (country === 'US' ||
      country === 'CN' ||
      country === 'AT' ||
      country === 'BE' ||
      country === 'BG' ||
      country === 'CZ' ||
      country === 'DE' ||
      country === 'ES' ||
      country === 'FR' ||
      country === 'HU' ||
      country === 'IN' ||
      country === 'PL' ||
      country === 'RO' ||
      country === 'RU' ||
      country === 'SK' ||
      country === 'UA') &&
    (month === '10' || month === '11' || month === '12')
  ) {
    return `2009/${month}/${day}`;
  } else if (
    commodity === 'wheat' &&
    (country === 'AR' || country === 'AU') &&
    (month === '06' ||
      month === '07' ||
      month === '08' ||
      month === '09' ||
      month === '10' ||
      month === '11' ||
      month === '12')
  ) {
    return `2009/${month}/${day}`;
  } else if (
    commodity === 'soybeans' &&
    (country === 'AR' || country === 'BR') &&
    (month === '09' || month === '10' || month === '11' || month === '12')
  ) {
    return `2009/${month}/${day}`;
  } else if (
    commodity === 'corn' &&
    country === 'BR' &&
    (month === '09' || month === '10' || month === '11' || month === '12')
  ) {
    return `2009/${month}/${day}`;
  } else if (
    commodity === 'rice' &&
    country === 'IN' &&
    (month === '09' || month === '10' || month === '11' || month === '12')
  ) {
    return `2009/${month}/${day}`;
  } else {
    return `2010/${month}/${day}`;
  }
}
