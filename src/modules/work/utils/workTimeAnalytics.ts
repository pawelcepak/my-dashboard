import type {
  WorkDayTimeAnalytics,
  WorkTimeAnalytics,
  WorkTimeCategory,
  WorkTimeSegment,
  WorkWeek,
} from '@/modules/work/types/work.types';

export const WORK_TIME_ANALYTICS_START_DATE = '2026-07-27';
export const STANDARD_WORK_START_MINUTES = 6 * 60 + 20;
export const STANDARD_WORK_END_MINUTES = 15 * 60;

const MINUTES_PER_DAY = 24 * 60;
const MILLISECONDS_PER_MINUTE = 60 * 1000;

function parseTimeToMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);

  return hours * 60 + minutes;
}

function createLocalDate(dateValue: string, minutes = 0): Date {
  const [year, month, day] = dateValue.split('-').map(Number);

  return new Date(year, month - 1, day, Math.floor(minutes / 60), minutes % 60, 0, 0);
}

function toIsoDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function addDays(dateValue: string, days: number): string {
  const date = createLocalDate(dateValue, 12 * 60);
  date.setDate(date.getDate() + days);

  return toIsoDate(date);
}

function getCategoryAt(value: Date): WorkTimeCategory {
  const dayOfWeek = value.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 'weekend';
  }

  const minutes = value.getHours() * 60 + value.getMinutes();

  if (minutes >= STANDARD_WORK_START_MINUTES && minutes < STANDARD_WORK_END_MINUTES) {
    return 'standard';
  }

  return 'additional';
}

function getNextBoundary(value: Date): Date {
  const dayOfWeek = value.getDay();
  const minutes = value.getHours() * 60 + value.getMinutes();
  const midnight = new Date(value);
  midnight.setHours(24, 0, 0, 0);

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return midnight;
  }

  if (minutes < STANDARD_WORK_START_MINUTES) {
    const boundary = new Date(value);
    boundary.setHours(6, 20, 0, 0);

    return boundary;
  }

  if (minutes < STANDARD_WORK_END_MINUTES) {
    const boundary = new Date(value);
    boundary.setHours(15, 0, 0, 0);

    return boundary;
  }

  return midnight;
}

function createSessionInterval(
  dateValue: string,
  startTime: string,
  endTime: string
): { start: Date; end: Date } {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const start = createLocalDate(dateValue, startMinutes);
  const endDate = endMinutes < startMinutes ? addDays(dateValue, 1) : dateValue;
  const end = createLocalDate(endDate, endMinutes);

  return { start, end };
}

function splitInterval(
  start: Date,
  end: Date,
  rangeStart: Date,
  rangeEnd: Date
): WorkTimeSegment[] {
  const clippedStart = new Date(Math.max(start.getTime(), rangeStart.getTime()));
  const clippedEnd = new Date(Math.min(end.getTime(), rangeEnd.getTime()));

  if (clippedEnd <= clippedStart) {
    return [];
  }

  const segments: WorkTimeSegment[] = [];
  let cursor = clippedStart;

  while (cursor < clippedEnd) {
    const boundary = getNextBoundary(cursor);
    const segmentEnd = boundary < clippedEnd ? boundary : clippedEnd;
    const minutes = Math.round((segmentEnd.getTime() - cursor.getTime()) / MILLISECONDS_PER_MINUTE);

    if (minutes > 0) {
      segments.push({
        date: toIsoDate(cursor),
        category: getCategoryAt(cursor),
        minutes,
      });
    }

    cursor = segmentEnd;
  }

  return segments;
}

export function getStandardHoursScore(minutes: number): number {
  if (minutes >= 420) return 6;
  if (minutes >= 360) return 5;
  if (minutes >= 300) return 4;
  if (minutes >= 180) return 3;
  if (minutes >= 60) return 2;

  return 1;
}

function isWeekday(dateValue: string): boolean {
  const day = createLocalDate(dateValue, 12 * 60).getDay();

  return day >= 1 && day <= 5;
}

function isDateEligibleForRating(dateValue: string, week: WorkWeek, now: Date): boolean {
  if (week.startDate < WORK_TIME_ANALYTICS_START_DATE) {
    return false;
  }

  return isWeekday(dateValue) && dateValue <= toIsoDate(now);
}

export function calculateWorkTimeAnalytics(
  targetWeek: WorkWeek,
  allWeeks: WorkWeek[],
  now: Date = new Date()
): WorkTimeAnalytics {
  const rangeStart = createLocalDate(targetWeek.startDate);
  const rangeEnd = createLocalDate(addDays(targetWeek.endDate, 1));
  const minutesByDate = new Map<
    string,
    { standard: number; additional: number; weekend: number }
  >();

  for (let offset = 0; offset < 7; offset += 1) {
    minutesByDate.set(addDays(targetWeek.startDate, offset), {
      standard: 0,
      additional: 0,
      weekend: 0,
    });
  }

  for (const week of allWeeks) {
    for (const day of week.days) {
      for (const session of day.sessions) {
        const interval = createSessionInterval(day.date, session.startTime, session.endTime);

        for (const segment of splitInterval(interval.start, interval.end, rangeStart, rangeEnd)) {
          const current = minutesByDate.get(segment.date);

          if (current) {
            current[segment.category] += segment.minutes;
          }
        }
      }
    }
  }

  const days: WorkDayTimeAnalytics[] = [...minutesByDate.entries()].map(([date, minutes]) => {
    const eligibleForRating = isDateEligibleForRating(date, targetWeek, now);

    return {
      date,
      standardMinutes: minutes.standard,
      additionalMinutes: minutes.additional,
      weekendMinutes: minutes.weekend,
      standardHoursScore: eligibleForRating ? getStandardHoursScore(minutes.standard) : null,
    };
  });

  const ratedDays = days.filter(
    (day): day is WorkDayTimeAnalytics & { standardHoursScore: number } =>
      day.standardHoursScore !== null
  );

  const totalStandardMinutes = days.reduce((total, day) => total + day.standardMinutes, 0);
  const totalAdditionalMinutes = days.reduce((total, day) => total + day.additionalMinutes, 0);
  const totalWeekendMinutes = days.reduce((total, day) => total + day.weekendMinutes, 0);

  const averageStandardHoursScore =
    ratedDays.length > 0
      ? ratedDays.reduce((total, day) => total + day.standardHoursScore, 0) / ratedDays.length
      : null;

  const bestDay = ratedDays.reduce<(WorkDayTimeAnalytics & { standardHoursScore: number }) | null>(
    (best, day) => {
      if (!best) return day;
      if (day.standardHoursScore > best.standardHoursScore) return day;
      if (
        day.standardHoursScore === best.standardHoursScore &&
        day.standardMinutes > best.standardMinutes
      ) {
        return day;
      }

      return best;
    },
    null
  );

  return {
    days,
    totalStandardMinutes,
    totalAdditionalMinutes,
    totalWeekendMinutes,
    averageStandardHoursScore,
    ratedDayCount: ratedDays.length,
    scoreFiveDayCount: ratedDays.filter((day) => day.standardHoursScore === 5).length,
    scoreSixDayCount: ratedDays.filter((day) => day.standardHoursScore === 6).length,
    bestDay,
  };
}

export function formatWorkTimeMinutes(totalMinutes: number): string {
  const hours =
    Math.floor(totalMinutes / MINUTES_PER_DAY) * 24 +
    Math.floor((totalMinutes % MINUTES_PER_DAY) / 60);
  const minutes = totalMinutes % 60;

  return `${hours} h ${String(minutes).padStart(2, '0')} min`;
}
