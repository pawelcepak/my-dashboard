export type WorkRatingPresentation = {
  label: string;
  color: string;
  className: string;
};

export type BeerPresentation = {
  label: string;
  className: string;
};

export type MessagesPerHourTrend = 'up' | 'neutral' | 'down' | 'empty';

export type MessagesPerHourPresentation = {
  trend: MessagesPerHourTrend;
  label: string;
  shortLabel: string;
  symbol: string;
  color: string;
  textClassName: string;
  badgeClassName: string;
  iconClassName: string;
};

export function formatWorkRating(rating: number | null): string {
  if (rating === null) {
    return '—';
  }

  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}

function normalizeWorkRating(rating: number): number {
  return Math.round(rating * 10) / 10;
}

export function getWorkRatingPresentation(rating: number | null): WorkRatingPresentation {
  if (rating === null) {
    return {
      label: 'Brak oceny',
      color: '#747d8a',
      className: 'border-zinc-700 bg-zinc-900 text-zinc-500',
    };
  }

  const normalizedRating = normalizeWorkRating(rating);

  if (normalizedRating >= 9) {
    return {
      label: 'Wyjątkowa',
      color: '#048511',
      className: 'border-[#048511]/60 bg-[#048511]/15 text-[#048511] dark:text-[#43d34f]',
    };
  }

  if (normalizedRating >= 8.9) {
    return {
      label: 'Świetna',
      color: '#0b9e1a',
      className: 'border-[#0b9e1a]/60 bg-[#0b9e1a]/15 text-[#0b9e1a] dark:text-[#4cda59]',
    };
  }

  if (normalizedRating >= 8.8) {
    return {
      label: 'Bardzo dobra',
      color: '#1abd2b',
      className: 'border-[#1abd2b]/60 bg-[#1abd2b]/15 text-[#1abd2b] dark:text-[#57e166]',
    };
  }

  if (normalizedRating >= 8.7) {
    return {
      label: 'Dobra plus',
      color: '#f5f507',
      className: 'border-[#f5f507]/70 bg-[#f5f507]/15 text-[#8a8a00] dark:text-[#f5f507]',
    };
  }

  if (normalizedRating >= 8.6) {
    return {
      label: 'Dobra',
      color: '#b3b307',
      className: 'border-[#b3b307]/70 bg-[#b3b307]/15 text-[#777700] dark:text-[#dada2c]',
    };
  }

  if (normalizedRating >= 8.5) {
    return {
      label: 'Domyślna',
      color: '#1ca1e8',
      className: 'border-[#1ca1e8]/60 bg-[#1ca1e8]/15 text-[#167eb5] dark:text-[#54bdf5]',
    };
  }

  if (normalizedRating >= 8.4) {
    return {
      label: 'Poniżej typowej',
      color: '#db0909',
      className: 'border-[#db0909]/60 bg-[#db0909]/15 text-[#b50707] dark:text-[#ff6464]',
    };
  }

  if (normalizedRating >= 8.3) {
    return {
      label: 'Słabsza',
      color: '#b50505',
      className: 'border-[#b50505]/60 bg-[#b50505]/15 text-[#990404] dark:text-[#f05b5b]',
    };
  }

  if (normalizedRating >= 8.2) {
    return {
      label: 'Niska',
      color: '#960505',
      className: 'border-[#960505]/60 bg-[#960505]/15 text-[#800404] dark:text-[#e05454]',
    };
  }

  return {
    label: 'Bardzo niska',
    color: '#6e0303',
    className: 'border-[#6e0303]/60 bg-[#6e0303]/15 text-[#6e0303] dark:text-[#d24b4b]',
  };
}

export function getMessagesPerHourPresentation(
  messagesPerHour: number | null
): MessagesPerHourPresentation {
  if (messagesPerHour === null || !Number.isFinite(messagesPerHour) || messagesPerHour <= 0) {
    return {
      trend: 'empty',
      label: 'Brak danych',
      shortLabel: 'Brak danych',
      symbol: '—',
      color: '#747d8a',
      textClassName: 'text-zinc-500',
      badgeClassName: 'border-zinc-700 bg-zinc-900 text-zinc-500',
      iconClassName: 'text-zinc-500',
    };
  }

  if (messagesPerHour >= 43) {
    return {
      trend: 'up',
      label: 'Wysoka wydajność',
      shortLabel: 'Wysoka',
      symbol: '↑',
      color: '#16a34a',
      textClassName: 'text-green-600 dark:text-green-400',
      badgeClassName: 'border-green-700/70 bg-green-950/20 text-green-700 dark:text-green-400',
      iconClassName: 'text-green-600 dark:text-green-400',
    };
  }

  if (messagesPerHour >= 36) {
    return {
      trend: 'neutral',
      label: 'Stabilna wydajność',
      shortLabel: 'Stabilna',
      symbol: '=',
      color: '#ca8a04',
      textClassName: 'text-yellow-600 dark:text-yellow-400',
      badgeClassName: 'border-yellow-700/70 bg-yellow-950/20 text-yellow-700 dark:text-yellow-400',
      iconClassName: 'text-yellow-600 dark:text-yellow-400',
    };
  }

  return {
    trend: 'down',
    label: 'Niska wydajność',
    shortLabel: 'Niska',
    symbol: '↓',
    color: '#dc2626',
    textClassName: 'text-red-600 dark:text-red-400',
    badgeClassName: 'border-red-800/70 bg-red-950/25 text-red-600 dark:text-red-400',
    iconClassName: 'text-red-600 dark:text-red-400',
  };
}

export function getBeerPresentation(beers: number): BeerPresentation {
  if (beers === 0) {
    return {
      label: 'Bez alkoholu',
      className: 'border-emerald-900/70 bg-emerald-950/50 text-emerald-300',
    };
  }

  return {
    label: `${beers}`,
    className: 'border-red-900/70 bg-red-950/50 text-red-300',
  };
}
