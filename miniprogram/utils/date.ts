export function today(): string {
  const d = new Date();
  return formatDate(d);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
}

export function dateFromString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getDateRange(days: number): string[] {
  const result: string[] = [];
  const d = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const t = new Date(d);
    t.setDate(t.getDate() - i);
    result.push(formatDate(t));
  }
  return result;
}
