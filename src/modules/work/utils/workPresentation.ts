export type WorkRatingPresentation = {
  label: string;
  className: string;
};

export type BeerPresentation = {
  label: string;
  className: string;
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

export function getWorkRatingPresentation(rating: number | null): WorkRatingPresentation {
  if (rating === null) {
    return {
      label: 'Brak oceny',
      className: 'border-zinc-800 bg-zinc-900 text-zinc-500',
    };
  }

  if (rating < 8) {
    return {
      label: 'Słabsza',
      className: 'border-red-900/70 bg-red-950/50 text-red-300',
    };
  }

  if (rating < 8.5) {
    return {
      label: 'Poniżej typowej',
      className: 'border-amber-900/70 bg-amber-950/50 text-amber-300',
    };
  }

  if (rating === 8.5) {
    return {
      label: 'Domyślna',
      className: 'border-blue-900/70 bg-blue-950/50 text-blue-300',
    };
  }

  if (rating < 8.8) {
    return {
      label: 'Dobra',
      className: 'border-sky-900/70 bg-sky-950/50 text-sky-300',
    };
  }

  if (rating < 9) {
    return {
      label: 'Bardzo dobra',
      className: 'border-lime-900/70 bg-lime-950/50 text-lime-300',
    };
  }

  return {
    label: 'Wyjątkowo dobra',
    className: 'border-emerald-900/70 bg-emerald-950/50 text-emerald-300',
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
