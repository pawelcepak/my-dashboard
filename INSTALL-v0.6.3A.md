# CHB v0.6.3A — Work UX Cleanup

Skopiuj zawartość paczki do katalogu głównego projektu i zaakceptuj zastąpienie plików.

## Zmiany

- panel aktywnego tygodnia pokazuje kolejno: Status danych, Euro, Złoty,
- kwota PLN jest liczona jako brutto EUR × kurs aktywnego tygodnia,
- menedżer tygodni pokazuje wyłącznie listę tygodni oraz przyciski Nowy tydzień i Usuń tydzień,
- usunięto powtórzony nagłówek aktywnego tygodnia i zakres dat.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```
