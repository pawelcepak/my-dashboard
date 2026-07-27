# CHB v0.6.1a — Portfolio UX Hotfix

Skopiuj zawartość paczki do głównego katalogu projektu i zaakceptuj zastąpienie plików.

Naprawia:

- błąd TypeScript dotyczący `PortfolioTransactionInput`,
- zwracanie wyniku importu CSV przez `usePortfolio`,
- ostrzeżenie hooka w formularzu transakcji,
- ostrzeżenie hooka w tabeli historii.

Po instalacji uruchom:

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

Commit wykonaj dopiero, gdy `release:prepare` zakończy się bez błędów i ostrzeżeń.
