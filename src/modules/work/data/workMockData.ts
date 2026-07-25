import type { WorkWeek } from '@/modules/work/types/work.types';

export const currentWorkWeek: WorkWeek = {
  id: 'work-week-2026-30',
  year: 2026,
  weekNumber: 30,
  startDate: '2026-07-20',
  endDate: '2026-07-26',
  heldMessages: 9,
  exchangeRateEurPln: 4.2,
  financialPlan: [
    {
      id: 'financial-plan-life',
      name: 'Życie',
      plannedAmountPln: 306,
    },
    {
      id: 'financial-plan-millennium',
      name: 'Millennium',
      plannedAmountPln: 75,
    },
  ],
  days: [
    {
      id: 'work-day-2026-07-20',
      date: '2026-07-20',
      beers: 2,
      workRating: 8.5,
      messages: 188,
      sessions: [
        {
          id: 'session-2026-07-20-1',
          startTime: '07:00',
          endTime: '11:00',
        },
      ],
    },
    {
      id: 'work-day-2026-07-21',
      date: '2026-07-21',
      beers: 0,
      workRating: 8.7,
      messages: 216,
      sessions: [
        {
          id: 'session-2026-07-21-1',
          startTime: '06:30',
          endTime: '11:30',
        },
      ],
    },
    {
      id: 'work-day-2026-07-22',
      date: '2026-07-22',
      beers: 3,
      workRating: 8.6,
      messages: 155,
      sessions: [
        {
          id: 'session-2026-07-22-1',
          startTime: '07:00',
          endTime: '10:18',
        },
      ],
    },
    {
      id: 'work-day-2026-07-23',
      date: '2026-07-23',
      beers: 1,
      workRating: 8.8,
      messages: 146,
      sessions: [
        {
          id: 'session-2026-07-23-1',
          startTime: '07:00',
          endTime: '10:30',
        },
      ],
    },
    {
      id: 'work-day-2026-07-24',
      date: '2026-07-24',
      beers: 0,
      workRating: 9,
      messages: 138,
      sessions: [
        {
          id: 'session-2026-07-24-1',
          startTime: '06:32',
          endTime: '07:18',
        },
        {
          id: 'session-2026-07-24-2',
          startTime: '07:24',
          endTime: '08:16',
        },
        {
          id: 'session-2026-07-24-3',
          startTime: '08:48',
          endTime: '09:08',
        },
        {
          id: 'session-2026-07-24-4',
          startTime: '09:48',
          endTime: '10:08',
        },
        {
          id: 'session-2026-07-24-5',
          startTime: '10:26',
          endTime: '10:50',
        },
        {
          id: 'session-2026-07-24-6',
          startTime: '11:46',
          endTime: '12:00',
        },
        {
          id: 'session-2026-07-24-7',
          startTime: '12:26',
          endTime: '13:06',
        },
        {
          id: 'session-2026-07-24-8',
          startTime: '14:14',
          endTime: '14:40',
        },
      ],
    },
    {
      id: 'work-day-2026-07-25',
      date: '2026-07-25',
      beers: 0,
      workRating: 8.5,
      messages: 0,
      sessions: [],
    },
    {
      id: 'work-day-2026-07-26',
      date: '2026-07-26',
      beers: 0,
      workRating: 8.5,
      messages: 0,
      sessions: [],
    },
  ],
};
