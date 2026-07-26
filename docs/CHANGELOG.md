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
- Clickable CHB header label leading to the Dashboard.
- Left-aligned desktop bottom navigation.
- Persistent active-work-week selection.
- Application settings table in Dexie.
- Dexie schema version 2.
- Dexie schema version 3.
- Migration of existing work data to the new schema.
- Migration of existing financial plans to priority-based records.
- Creating arbitrary ISO work weeks.
- Automatic Monday-to-Sunday work-week ranges.
- Automatic current ISO week proposal.
- Switching between saved work weeks.
- Protection against duplicate year and week-number combinations.
- Optional copying of exchange rate, goals and financial plan.
- Copying financial-goal priorities and lock states to new weeks.
- Empty daily records for newly created weeks.
- Reactive week switching between Dashboard and Work module.
- Weekly work-history section.
- Work weeks grouped by year.
- Reusable history-card component.
- Weekly history metrics for messages, hours, performance, earnings, rating, beer count and goal completion.
- Active-week information in the global application header.
- Complete JSON export of work weeks and application settings.
- JSON backup-file validation.
- Backup preview before restoring data.
- Transaction-based replacement of the local database.
- Automatic recovery of the active-week setting during import.
- Last-backup timestamp.
- Backup and restore panel in Settings.
- Backward-compatible import of backups created before financial priorities were introduced.
- Automated deployment to GitHub Pages.
- Production configuration for the GitHub Pages repository path.
- Hash-based routing compatible with static hosting.
- Compact Dashboard control-center layout.
- Priority-based financial goals.
- Sequential allocation of weekly net earnings between financial goals.
- Individual progress percentage for each financial goal.
- Financial-goal completion indicators.
- Editable financial-goal ordering.
- Financial-goal locking and unlocking.
- Safe removal of unlocked financial goals.
- Automatic financial-priority normalization.
- Strongly confirmed work-week deletion.
- Automatic active-week recovery after deleting the selected week.
- Protection against deleting the last remaining work week.

### Changed

- Navigation moved from the left sidebar to the bottom edge.
- Desktop bottom navigation is aligned to the left.
- Application content now uses the full available width.
- Application name changed from My Dashboard to CHB.
- The CHB label in the application header is now a Dashboard link.
- Active navigation uses a crimson accent.
- Dashboard layout is more compact and requires less scrolling.
- Dashboard daily metrics have stronger visual hierarchy.
- Quick work actions are divided into clearer groups.
- Weekly work overview is displayed as a compact summary strip.
- Financial-plan summary has clearer progress and allocation presentation.
- Placeholder modules occupy less Dashboard space.
- Dark theme now uses a dark-gray palette instead of near-black or overly light gray.
- Light-theme borders and surfaces have stronger contrast.
- Informational, warning, success and error messages have improved contrast.
- Shared panels and section cards use a more consistent visual system.
- Theme-toggle presentation and interaction have been improved.
- Work module now operates on an explicitly selected active week.
- Reset action now clears activity from the selected week instead of restoring example data.
- Dashboard automatically displays the selected active work week.
- Work-week selector replaces the previous single-week workflow.
- The work-week compound index is now unique.
- Work history is ordered from the newest week to the oldest.
- Selecting a history card changes the active week without reloading the application.
- The application header displays the active week number and date range.
- Settings page now contains local-data safety tools.
- New financial goals are always added at the end of the priority list.
- Financial-plan priorities are renumbered automatically after reordering or deletion.
- Locked financial goals cannot be moved or removed.
- Financial progress is calculated separately and sequentially for every goal.
- Older backup files receive default priority and lock values during import.
- Static production routing now uses URL hashes to prevent direct-route 404 errors.

### Fixed

- Fixed TypeScript path aliases without using deprecated `baseUrl`.
- Fixed native Vite TypeScript-path resolution.
- Fixed repository initialization at the incorrect Desktop directory level.
- Fixed incomplete Git merge completion.
- Fixed GitHub Pages workflow placement on a feature branch.
- Fixed production asset paths for GitHub Pages.
- Fixed direct-page refreshes on static hosting.
- Fixed financial goals being inserted ahead of existing priorities.
- Fixed financial-goal reordering being reverted by priority sorting.
- Fixed missing `priority` and `locked` values in newly created financial goals.
- Fixed missing `priority` and `locked` values when copying financial plans.
- Fixed compatibility of older JSON backups with the financial-goal model.
- Fixed deletion of an active week leaving an invalid active-week setting.

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