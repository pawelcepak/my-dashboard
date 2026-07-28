# CHB v0.7.0 — Alcohol Analytics

## Zakres

- nowa zakładka `Alkohol`,
- dni picia i liczba piw pobierane z `Work`,
- wydatki od czerwca 2026 pobierane z wybranych tagów `Portfela`,
- historyczne dni picia z arkusza `BrPW` przed 16.02.2026,
- ręczne miesięczne wydatki od grudnia 2024 do maja 2026,
- ręczne zaznaczenie lub odznaczenie dnia jako korekta,
- przycisk przywracający stan automatyczny z Work,
- historia miesięczna i podstawowe statystyki,
- pełna obsługa Dexie, backupu i chmury.

Zaimportowane dane:

- 213 historycznych dni picia,
- 18 miesięcy kosztów historycznych.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

Po uruchomieniu:

1. Otwórz `Alkohol`.
2. Sprawdź luty 2026: pierwsza połowa pochodzi z historii, druga z Work.
3. Zmień liczbę piw w Work i sprawdź kalendarz Alkohol.
4. Kliknij dzień w kalendarzu i sprawdź ręczną korektę.
5. Kliknij ikonę przywracania AUTO.
6. Sprawdź, czy tag `browary` jest zaznaczony w powiązaniu z Portfelem.
7. Poczekaj na `Chmura aktualna`.
