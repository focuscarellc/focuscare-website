// Derived metadata keeps the article's wording while removing presentation syntax.
export function plainText(value) {
  return String(value ?? '')
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[*_`#]/g, '')
    .replace(/^TL;DR:\s*/i, '')
    .replace(/\s+/g, ' ').trim();
}

export function descriptionFor(value, limit = 155) {
  const text = plainText(value);
  if (text.length <= limit) return text;
  const sentence = text.match(new RegExp('^.{30,' + (limit - 1) + '}[.!?](?=\\s|$)'))?.[0];
  if (sentence) return sentence;
  const words = text.split(' '), kept = [];
  for (const word of words) {
    if ([...kept, word].join(' ').length > limit - 3) break;
    kept.push(word);
  }
  return kept.join(' ').replace(/[,:;.!?]+$/, '') + '...';
}

export function assertCleanText(text, label) {
  if (/\u00c2[\u00a0-\u00bf]|\u00e2(?:\u20ac|\u0080)|\ufffd/.test(text)) {
    throw new Error('Text encoding corruption in ' + label);
  }
}

// Publication dates are calendar dates, not local-midnight timestamps.
export function calendarDate(value) {
  if (!value) return undefined;
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const written = value.match(/^([A-Za-z]+) (\d{1,2}), (\d{4})$/);
  const [year, month, day] = iso ? iso.slice(1).map(Number) : written ? [Number(written[3]), months.indexOf(written[1]) + 1, Number(written[2])] : [];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!month || date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) throw Error('Invalid publication date: ' + value);
  return date.toISOString().slice(0, 10);
}
