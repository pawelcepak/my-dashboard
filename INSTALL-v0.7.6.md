# CHB v0.7.6 — Debt Management Foundation

## Zakres

- pięć długów z arkusza `Minusy`,
- dwie historyczne spłaty,
- ręczne dodawanie spłat,
- ręczna aktualizacja rzeczywistego salda,
- historia wszystkich zmian,
- edycja i usuwanie długów,
- Dexie schema 8,
- backup format 4,
- synchronizacja chmurowa.

## Test

```bash
npm run release:prepare
npm run dev
```

Otwórz zakładkę `Długi`. Początkowe sumy powinny wynosić:

- początkowo: 20 341,44 zł,
- aktualnie: 20 120,02 zł,
- wpłacono: 221,42 zł.

Dodaj testową spłatę, potem ręcznie podnieś aktualne saldo o dowolną wartość. Oba wpisy powinny pojawić się w historii i synchronizować z backupem oraz chmurą.
