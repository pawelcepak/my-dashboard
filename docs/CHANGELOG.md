# Changelog

All notable changes to CHB will be documented in this file.

## [Unreleased]

### Added

- Light and dark application themes.
- Persistent theme preference.
- Theme toggle in the application header.
- Bottom tab navigation.
- Compact mobile navigation with an additional More panel.
- Crimson active-navigation state.
- CHB application branding.
- Persistent active-work-week selection.
- Application settings table in Dexie.
- Dexie schema version 2.
- Migration of existing work data to the new schema.
- Creating arbitrary ISO work weeks.
- Automatic Monday-to-Sunday work-week ranges.
- Automatic current ISO week proposal.
- Switching between saved work weeks.
- Protection against duplicate year and week-number combinations.
- Optional copying of exchange rate, goals and financial plan.
- Empty daily records for newly created weeks.
- Reactive week switching between Dashboard and Work module.

### Changed

- Navigation moved from the left sidebar to the bottom edge.
- Application content now uses the full available width.
- Application name changed from My Dashboard to CHB.
- Active navigation uses a crimson accent.
- Dark theme uses a lighter gray background.
- Light-theme borders have stronger contrast.
- Work module now operates on an explicitly selected active week.
- Reset action now clears activity from the selected week instead of restoring example data.
- Dashboard automatically displays the selected active work week.
- Work-week selector replaces the previous single-week workflow.
- The work-week compound index is now unique.

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
