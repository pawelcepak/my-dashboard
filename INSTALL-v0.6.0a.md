# CHB v0.6.0a — Cloud Compatibility Hotfix

Skopiuj zawartość paczki do głównego katalogu `my-dashboard`
i zaakceptuj zastąpienie plików.

## Naprawiony błąd

```text
backup.data.portfolioAccounts is not iterable
```

Snapshoty chmurowe utworzone przed modułem Portfel nie zawierają:
`portfolioAccounts`, `portfolioTags` ani `portfolioTransactions`.
Hotfix normalizuje brakujące pola do pustych tablic przed
porównaniem, fingerprintem i przywracaniem danych.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

Po uruchomieniu aplikacji:

1. Otwórz panel błędu chmury.
2. Kliknij `Porównaj ponownie`.
3. Gdy pojawi się konflikt po zmianie formatu snapshotu, wybierz
   `Zachowaj dane lokalne`.
4. Poczekaj na status `Chmura aktualna`.

Zachowanie danych lokalnych jest właściwe, ponieważ lokalna baza
zawiera już nowy model Portfela, a snapshot chmurowy jest starszy.
