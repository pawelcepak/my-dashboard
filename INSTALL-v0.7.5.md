# CHB v0.7.5 — Global Panel System Pilot

Ten sprint celowo wdraża system tylko w jednym miejscu:
`Analiza godzin pracy`.

## Zachowanie

- panel jest domyślnie zwinięty,
- kliknięcie całego nagłówka rozwija lub zwija zawartość,
- zwinięty nagłówek pokazuje czas standardowy i średnią ocenę,
- stan zostaje zapamiętany po odświeżeniu,
- stan jest lokalny dla konkretnej przeglądarki i urządzenia,
- nie zmienia schematu Dexie, backupu ani Supabase.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

Po uruchomieniu:

1. Otwórz `Praca`.
2. Sprawdź, czy `Analiza godzin pracy` jest zwinięta.
3. Rozwiń panel.
4. Odśwież stronę — panel powinien pozostać rozwinięty.
5. Zwiń panel i ponownie odśwież stronę.
6. Sprawdź działanie w jasnym i ciemnym motywie.
