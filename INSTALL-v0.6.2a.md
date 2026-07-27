# CHB v0.6.2a — Navigation Hotfix

Naprawia:

- błędy typów `onSave` i `onCreateTag` w module Portfel,
- przeciąganie dolnych zakładek,
- natychmiastowe przesuwanie strzałkami,
- lokalny podgląd kolejności przed zakończeniem zapisu.

## Instalacja

Skopiuj zawartość ZIP-a do katalogu głównego projektu i zaakceptuj
zastąpienie plików.

## Test

```bash
npm run format
npm run lint
npm run build
npm run docs:generate
npm run docs:check
npm run dev
```

W Ustawieniach przesuń Portfel przed Pracę najpierw strzałką, a potem
przeciąganiem.

`cleanup-empty-project-items.bat` jest opcjonalny. Usuwa jedynie pusty
`docs/LICENSE` i kilka pustych katalogów po dawnych szablonach.
