# CHB v0.7.4A–D — Work Time Analytics

Paczka korzysta z aktualnego projektu przekazanego 28.07.2026.

## Kategorie

- Standardowe: poniedziałek–piątek, 06:20–15:00.
- Dodatkowe: pozostałe godziny poniedziałku–piątku.
- Weekendowe: sobota i niedziela przez całą dobę.

Bloki są dzielone przy 06:20, 15:00, północy oraz granicach weekendu.
Ocena standardowych godzin działa od 2026-W31.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

Sprawdź bloki:

- 14:00–16:00 w dzień roboczy,
- 05:30–07:00 w dzień roboczy,
- piątek 23:00–sobota 01:00,
- niedziela 23:50–poniedziałek 00:20.
