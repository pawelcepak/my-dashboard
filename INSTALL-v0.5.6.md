# CHB v0.5.6 — Historical Work Import

Copy the package contents into the root of the `my-dashboard` repository
and allow existing files to be replaced.

## Before importing data

1. Run the technical checks.
2. Start the application.
3. Open **Ustawienia**.
4. Download a current JSON backup.
5. Use **Historia pracy 2026** to add missing weeks 8–29.

Existing weeks are skipped. Weeks 30 and 31 are not part of the package.

## Technical checks

```bash
npm run docs:validate
npm run docs:generate
npm run docs:check
npm run release:prepare
npm run dev
```

## Source limitations

The screenshots contain total daily duration, not exact clock timestamps.
Positive duration is stored in one technical session beginning at 06:20.
Its ID contains `duration-placeholder`, so future hour-of-day analysis can
ignore it.

Historical EUR/PLN is initialized to 4.20 and can be edited per week later.
