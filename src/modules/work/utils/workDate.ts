import type { WorkDay, WorkWeek } from '@/modules/work/types/work.types';

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

export function getLocalIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());

  return `${year}-${month}-${day}`;
}

export function findWorkDayByDate(week: WorkWeek, date: string): WorkDay | undefined {
  return week.days.find((day) => day.date === date);
}

export function formatLongLocalDate(date: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function capitalizeFirstLetter(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toLocaleUpperCase('pl-PL') + value.slice(1);
}

export function isDateInsideWorkWeek(week: WorkWeek, date: string): boolean {
  return date >= week.startDate && date <= week.endDate;
}
