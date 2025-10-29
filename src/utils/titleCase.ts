export function toTitleCase(text: string): string {
  if (!text) return '';
  const normalizedWhitespace = text.trim().replace(/\s+/g, ' ');
  const lower = normalizedWhitespace.toLocaleLowerCase('pt-BR');
  return lower
    .split(' ')
    .map((word) =>
      word.length > 0 ? word[0].toLocaleUpperCase('pt-BR') + word.slice(1) : ''
    )
    .join(' ');
}
