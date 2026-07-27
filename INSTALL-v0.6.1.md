# CHB v0.6.1 — Portfolio UX A–D

Skopiuj zawartość paczki do katalogu głównego projektu i zaakceptuj
zastąpienie plików.

## Zakres

### A — Szybkie wprowadzanie

- Enter zapisuje formularz,
- zapamiętywanie ostatniego tagu przychodu i wydatku,
- automatyczny EnterTalkPro dla pierwszego przychodu,
- naturalna kolejność Tab.

### B — Historia

- kompaktowa tabela,
- filtry rodzaju, tagu i tekstu,
- sortowanie po dacie,
- edycja całego wiersza w tabeli,
- Enter zapisuje, Escape anuluje.

### C — Statystyki

- przychody bieżącego miesiąca,
- wydatki bieżącego miesiąca,
- średni wydatek na dzień z wydatkiem,
- udział kategorii wydatków.

### D — CSV

- import plików CSV,
- podgląd błędów przed importem,
- polskie i angielskie nagłówki,
- automatyczne tworzenie brakujących tagów,
- szablon CSV do pobrania.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

Przed pierwszym testem CSV pobierz kopię JSON w Ustawieniach.
