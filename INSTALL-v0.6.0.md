# CHB v0.6.0 — Portfolio Foundation

Skopiuj zawartość paczki do katalogu głównego `my-dashboard` i zezwól
na zastąpienie istniejących plików.

## Zakres

- funkcjonalny moduł Portfel,
- ręczne dodawanie przychodów i wydatków,
- wiele transakcji jednego dnia,
- automatyczne saldo,
- punkt początkowy 315,71 zł z datą 07.05.2026,
- opcjonalne notatki,
- tworzenie, edycja i usuwanie tagów,
- domyślny tag przychodowy EnterTalkPro,
- domyślne tagi wydatkowe odtworzone z arkusza,
- wykres salda bez dodatkowej biblioteki,
- pełna obsługa Dexie, backupu i synchronizacji Supabase,
- `create-project-zip.bat` do tworzenia lekkiego ZIP-a projektu.

## Ważne

Paczka nie importuje jeszcze wszystkich historycznych transakcji ze screenów.
Tworzy stabilny model i interfejs do ich późniejszego wpisania lub osobnej migracji.

`create-project-zip.bat` pomija:

- `.git`,
- `node_modules`,
- `dist`,
- pliki `.env*`,
- istniejące ZIP-y.

Pliki środowiskowe są pomijane, aby klucze Supabase nie trafiły do archiwum.

## Test

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```
