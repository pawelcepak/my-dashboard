import type {
  PortfolioCsvPreview,
  PortfolioCsvRow,
  PortfolioTransactionType,
} from '@/modules/portfolio/types/portfolio.types';

const DATE_HEADERS = ['data', 'date'];
const AMOUNT_HEADERS = ['kwota', 'amount', 'wartosc', 'wartość'];
const TYPE_HEADERS = ['rodzaj', 'type', 'typ'];
const TAG_HEADERS = ['tag', 'kategoria', 'category'];
const NOTE_HEADERS = ['notatka', 'note', 'opis', 'description'];

function normalizeHeader(value: string): string {
  return value.trim().toLocaleLowerCase('pl-PL');
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }

      continue;
    }

    if (character === delimiter && !quoted) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  values.push(current.trim());

  return values;
}

function findColumn(headers: string[], supportedHeaders: string[]): number {
  return headers.findIndex((header) => supportedHeaders.includes(normalizeHeader(header)));
}

function parseDate(value: string): string | null {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function parseAmount(value: string): number | null {
  const normalized = value.replace(/\s/g, '').replace(/zł/gi, '').replace(',', '.');

  const amount = Number.parseFloat(normalized);

  return Number.isFinite(amount) ? amount : null;
}

function parseType(typeValue: string, amount: number): PortfolioTransactionType {
  const normalized = typeValue.trim().toLocaleLowerCase('pl-PL');

  if (['przychod', 'przychód', 'income', 'plus', '+'].includes(normalized)) {
    return 'income';
  }

  if (['wydatek', 'expense', 'minus', '-'].includes(normalized)) {
    return 'expense';
  }

  return amount >= 0 ? 'income' : 'expense';
}

export function parsePortfolioCsv(text: string): PortfolioCsvPreview {
  const normalizedText = text.replace(/^\uFEFF/, '').trim();

  if (!normalizedText) {
    return {
      rows: [],
      errors: ['Plik CSV jest pusty.'],
    };
  }

  const lines = normalizedText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      rows: [],
      errors: ['CSV musi zawierać nagłówek i co najmniej jeden wiersz.'],
    };
  }

  const delimiter =
    (lines[0].match(/;/g)?.length ?? 0) >= (lines[0].match(/,/g)?.length ?? 0) ? ';' : ',';

  const headers = splitCsvLine(lines[0], delimiter);

  const dateColumn = findColumn(headers, DATE_HEADERS);
  const amountColumn = findColumn(headers, AMOUNT_HEADERS);
  const typeColumn = findColumn(headers, TYPE_HEADERS);
  const tagColumn = findColumn(headers, TAG_HEADERS);
  const noteColumn = findColumn(headers, NOTE_HEADERS);

  const errors: string[] = [];

  if (dateColumn < 0) {
    errors.push('Brakuje kolumny Data.');
  }

  if (amountColumn < 0) {
    errors.push('Brakuje kolumny Kwota.');
  }

  if (errors.length > 0) {
    return { rows: [], errors };
  }

  const rows: PortfolioCsvRow[] = [];

  lines.slice(1).forEach((line, index) => {
    const rowNumber = index + 2;
    const values = splitCsvLine(line, delimiter);

    const date = parseDate(values[dateColumn] ?? '');
    const rawAmount = parseAmount(values[amountColumn] ?? '');

    if (!date) {
      errors.push(`Wiersz ${rowNumber}: nieprawidłowa data.`);
      return;
    }

    if (rawAmount === null || rawAmount === 0) {
      errors.push(`Wiersz ${rowNumber}: kwota musi być różna od zera.`);
      return;
    }

    const type = parseType(typeColumn >= 0 ? (values[typeColumn] ?? '') : '', rawAmount);

    rows.push({
      rowNumber,
      date,
      type,
      amount: Math.abs(rawAmount),
      tagName: tagColumn >= 0 ? (values[tagColumn]?.trim() ?? '') : '',
      note: noteColumn >= 0 ? (values[noteColumn]?.trim() ?? '') : '',
    });
  });

  return { rows, errors };
}

export function createPortfolioCsvTemplate(): string {
  return [
    'Data;Rodzaj;Kwota;Tag;Notatka',
    '2026-07-27;Wydatek;14,89;browary;Przykładowa transakcja',
    '2026-07-27;Przychód;456,43;EnterTalkPro;Przykładowy przychód',
  ].join('\n');
}
