export const hourRegex: RegExp = /([0-1][0-9]):([0-5][0-9])/;

export interface Hour {
  hour: number;
  min: number;
}

export function toHour(hourString: string): Hour | null {
  const hourMatcher = hourRegex.exec(hourString);
  if (!hourMatcher || hourMatcher.length < 2) {
    return null;
  }
  let hour = hourMatcher[1].startsWith('0') ? Number(hourMatcher[1][1]) : Number(hourMatcher[1]);
  let min = hourMatcher[2].startsWith('0') ? Number(hourMatcher[2][1]) : Number(hourMatcher[2]);
  hour = isNaN(hour) ? 0 : hour;
  min = isNaN(min) ? 0 : min;
  return { hour, min };
}
