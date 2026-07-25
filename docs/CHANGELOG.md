# Changelog

All notable changes to My Dashboard will be documented in this file.

## [Unreleased]

### Added

- Automatic local-date detection on the Dashboard.
- Automatic matching of the current date with a work-day record.
- Current-day work summary on the Dashboard.
- Quick editing of daily messages from the Dashboard.
- Quick editing of daily work rating from the Dashboard.
- Quick editing of daily beer count from the Dashboard.
- Quick work-session creation from the Dashboard.
- Editable daily message target.
- Editable weekly message target.
- Editable daily hours target.
- Weekly work overview on the Dashboard.
- Weekly goal-progress presentation.
- Work-threshold progress on the Dashboard.
- Editable weekly financial plan on the Dashboard.
- Live synchronization between Dashboard and Work module through Dexie.
- Graceful state for dates outside the active work week.
- Graceful state for missing current-day records.
- Reusable local-date utilities.

### Changed

- Dashboard Work card now displays real data from IndexedDB.
- Dashboard Work card now displays total worked hours.
- Dashboard Work card now displays message count and net PLN earnings.
- Dashboard is now an active daily-work interface rather than a static overview.
- Dashboard and Work module use the same reactive work-week record.
- Financial-plan changes made on the Dashboard are immediately visible in the Work module.
- Goals are now persisted as part of the active work week.

## [0.3.0-beta.3] - 2026-07-25

### Added

- Persistent local storage for work weeks using Dexie and IndexedDB.
- Versioned database schema for work-week records.
- Reactive work-week queries using `dexie-react-hooks`.
- Transaction-based work-week updates.
- Automatic database initialization when no work data exists.
- Loading, saving and database-error states in the Work module.
- Weekly goal model prepared for Dashboard quick actions.
- Confirmation before resetting persistent work data.

### Changed

- Work module now reads its current week from IndexedDB.
- Work-day edits are written automatically to the database.
- Work-session edits are written automatically to the database.
- Weekly settings are written automatically to the database.
- Financial-plan edits are written automatically to the database.
- Work data is no longer stored only in React component state.
- Example work data is now used only to initialize an empty database.
- Work-week records now include ISO creation and update timestamps.

## [0.3.0-beta.2] - 2026-07-25

### Added

- Interactive editing of work-day statistics.
- Adding, editing and removing work sessions.
- Immediate recalculation of worked time and hourly performance.
- Editable held-message count.
- Editable EUR/PLN exchange rate.
- Editable weekly financial plan.
- Reset option for example work-week data.
- Decimal work ratings from 0.0 to 10.0.
- Color-coded work-rating indicators.
- Color-coded alcohol indicators.

### Changed

- Work-day table now supports selecting days for editing.
- Work summary reacts immediately to user input.
- Default work rating is represented as 8.5.
- Work ratings and beer counts are visually emphasized.

### Known limitations

- Work data remains in memory and is reset after a page refresh.
- Permanent Dexie storage is not yet connected.

## [0.3.0-beta.1] - 2026-07-25

### Added

- Initial responsive Work module interface.
- Weekly message and time summary.
- Message-rate thresholds.
- Held-message earnings.
- Payout-fee calculation.
- EUR and PLN earnings calculation.
- Weekly progress toward the next message threshold.
- Work-day table with mobile presentation.
- Weekly financial-plan summary.
- Example work-week data.

### Known limitations

- The Work module uses example data.
- Editing and persistent storage are not available.

## [0.2.1] - 2026-07-25

### Added

- Responsive application layout.
- Desktop and mobile navigation.
- Lucide icon integration.
- Dashboard summary cards.
- Recent activity placeholder.
- Application status panel.
- Shared PageHeader, MetricCard and SectionCard components.

### Changed

- Improved global dark-theme styles.
- Updated application navigation styling.
- Added responsive mobile behavior.
- Reinitialized the Git repository at the correct project root.

## [0.1.0] - 2026-07-24

### Added

- Initial React, TypeScript and Vite project.
- React Router configuration.
- Tailwind CSS configuration.
- Oxlint and Prettier configuration.
- Import aliases.
- Initial project structure.
- Initial documentation.
- Git repository and GitHub remote.
