type IsoWeekInformation = {
  year: number;
  weekNumber: number;
};

type IsoWeekDateRange = {
  startDate: string;
  endDate: string;
};

const MILLISECONDS_PER_DAY = 86_400_000;

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

function formatUtcDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    padDatePart(date.getUTCMonth() + 1),
    padDatePart(date.getUTCDate()),
  ].join('-');
}

function createUtcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 12));
}

export function getIsoWeekInformation(sourceDate = new Date()): IsoWeekInformation {
  const date = createUtcDate(sourceDate.getFullYear(), sourceDate.getMonth(), sourceDate.getDate());

  const dayNumber = date.getUTCDay() || 7;

  date.setUTCDate(date.getUTCDate() + 4 - dayNumber);

  const isoYear = date.getUTCFullYear();
  const isoYearStart = createUtcDate(isoYear, 0, 1);

  const weekNumber = Math.ceil(
    ((date.getTime() - isoYearStart.getTime()) / MILLISECONDS_PER_DAY + 1) / 7
  );

  return {
    year: isoYear,
    weekNumber,
  };
}

export function getIsoWeeksInYear(year: number): number {
  return getIsoWeekInformation(new Date(year, 11, 28, 12)).weekNumber;
}

export function getIsoWeekDateRange(year: number, weekNumber: number): IsoWeekDateRange {
  const maximumWeekNumber = getIsoWeeksInYear(year);

  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > maximumWeekNumber) {
    throw new Error(`Nieprawidłowy tydzień ISO ${weekNumber} dla roku ${year}.`);
  }

  const januaryFourth = createUtcDate(year, 0, 4);
  const januaryFourthDay = januaryFourth.getUTCDay() || 7;

  const firstMonday = new Date(januaryFourth);
  firstMonday.setUTCDate(januaryFourth.getUTCDate() - januaryFourthDay + 1);

  const monday = new Date(firstMonday);
  monday.setUTCDate(firstMonday.getUTCDate() + (weekNumber - 1) * 7);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return {
    startDate: formatUtcDate(monday),
    endDate: formatUtcDate(sunday),
  };
}

export function addDaysToIsoDate(isoDate: string, numberOfDays: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);

  date.setUTCDate(date.getUTCDate() + numberOfDays);

  return formatUtcDate(date);
}

export function formatWorkWeekLabel(year: number, weekNumber: number): string {
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}
