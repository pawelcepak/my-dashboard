# CHB v0.6.2 — Customizable Bottom Navigation

Skopiuj zawartość paczki do katalogu głównego projektu i zaakceptuj
zastąpienie plików.

## Zakres

- kolejność dolnych zakładek ustawiana bez kodu,
- przeciąganie pozycji myszą,
- strzałki do zmiany kolejności na ekranach dotykowych i klawiaturze,
- osobny kolor każdej zakładki z palety,
- globalny akcent aplikacji pozostaje niezależny,
- pierwsze cztery zakładki w kolejności są głównymi kartami mobilnymi,
- pozostałe trafiają do menu „Więcej”,
- desktopowy pasek przewija się poziomo przy większej liczbie kart,
- kolejność i kolory trafiają do Dexie, backupu oraz Supabase.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

W Ustawieniach otwórz panel „Dolne zakładki”, zmień kolejność i kolory,
a następnie sprawdź widok desktopowy oraz mobilny.
