# Changelog

All notable changes to CHB will be documented in this file.

## [Unreleased]

### Added

- Private Supabase authentication for the single CHB account.
- Persistent authenticated sessions across refreshes and browser restarts.
- Protected application shell for unauthenticated users.
- Supabase configuration through Vite environment variables.
- GitHub Actions support for Supabase production secrets.
- Cloud connection status in the application header.
- Expandable cloud-status panel with account, device, internet and timestamp details.
- Manual upload of the complete local Dexie database to a private Supabase snapshot.
- Manual restoration of the complete cloud snapshot to the local Dexie database.
- Strong confirmation before replacing local or cloud data.
- Cloud snapshot validation through the existing CHB backup validation layer.
- Local and cloud data fingerprints for version comparison.
- Persistent per-device cloud synchronization metadata.
- Detection of empty cloud storage, synchronized data, local changes, newer cloud data and conflicts.
- Manual conflict resolution by preserving either the local or cloud version.
- Modular cloud architecture with dedicated snapshot, comparison, metadata and synchronization services.
- Persistent local dirty-state tracking with revision numbers.
- Dirty tracking for work-week edits, resets, creation, deletion and active-week changes.
- Debounced automatic cloud upload after 2.5 seconds without further local changes.
- Revision-safe dirty-state clearing when changes occur during an upload.
- Automatic synchronization after internet connectivity returns.
- Safe startup synchronization after login or page reload.
- Automatic startup upload when local data is unambiguously newer or the cloud is empty.
- Automatic startup download when the cloud is unambiguously newer.
- Conflict protection that prevents automatic overwrite when both versions changed.
- Offline-first operation while synchronization is unavailable.
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
- Dexie schema version 4.
- Migration of existing work data to the new schema.
- Migration of existing financial plans to priority-based records.
- Migration of existing work goals to synchronized daily, five-day and seven-day values.
- Creating arbitrary ISO work weeks.
- Automatic Monday-to-Sunday work-week ranges.
- Automatic current ISO week proposal.
- Switching between saved work weeks.
- Protection against duplicate year and week-number combinations.
- Optional copying of exchange rate, goals and financial plan.
- Copying synchronized work goals to newly created weeks.
- Copying financial-goal priorities and lock states to new weeks.
- Empty daily records for newly created weeks.
- Reactive week switching between Dashboard and Work module.
- Weekly work-history section.
- Work weeks grouped by year.
- Reusable history-card component.
- Weekly history metrics for messages, hours, performance, earnings, rating, beer count, blocks and goal completion.
- Active-week information in the global application header.
- Complete JSON export of work weeks and application settings.
- JSON backup-file validation.
- Backup preview before restoring data.
- Transaction-based replacement of the local database.
- Automatic recovery of the active-week setting during import.
- Last-backup timestamp.
- Backup and restore panel in Settings.
- Backward-compatible import of backups created before financial priorities were introduced.
- Backward-compatible import of backups created before synchronized five-day and seven-day work goals were introduced.
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
- Synchronized daily message target.
- Synchronized seven-day weekly message target.
- Synchronized five-day weekly message target.
- Shared work-goal synchronization engine.
- Independent daily-hours target.
- Immediate goal recalculation while editing on the Dashboard.
- Separate five-day and seven-day goal progress indicators in the Work module.
- Synchronized work-goal summary in the Work module.
- Financial-goal progress displayed sequentially on the Dashboard.
- Shared message-rate threshold bar.
- Full message-rate scale from 0 to 1,976 messages.
- Visual threshold markers for 776, 1,576 and 1,976 messages.
- Current-message position indicator on the message-rate scale.
- Current-rate and next-threshold information.
- Shared message-rate threshold presentation on Dashboard and Work page.
- Exact custom work-rating color scale.
- Rating-color support for individual days and weekly averages.
- Active-week history redesigned as the primary left-side work view.
- Compact active-week summary panel.
- Redesigned weekly-history cards.
- Weekly-history block count.
- Visual active-week marker in history cards.
- Responsive active-week work layout.
- Machine-readable AI Project Interface manifest.
- Module registry with dependencies, entry files and AI-specific notes.
- Known-issue registry with severity, status, workarounds and planned resolutions.
- Generated AGENTS.md guidance for generic coding agents.
- Generated CLAUDE.md guidance for Claude-compatible coding tools.
- Generated Cursor project rules derived from the same vendor-neutral source.
- Generated AI Project Interface documentation and machine-readable manifest.
- Current-time defaults for every newly created work session.
- Automatic two-minute default duration for newly created work sessions.
- Controlled one-time import of 2026 ISO work weeks 8–29.
- Duplicate-safe historical import that preserves existing weeks.
- Verified historical totals for paid messages and beer counts.
- Technical duration-placeholder sessions for historical daily working time.
- Historical-import status and action panel in Settings.
- Functional Portfolio ledger with manual income and expense entries.
- Automatic running balance from an editable initial balance.
- Multiple Portfolio transactions on the same date.
- Optional notes for Portfolio transactions.
- Editable income, expense and shared Portfolio tags.
- Lightweight Portfolio balance chart without an additional chart library.
- Portfolio data support in Dexie, JSON backups and Supabase snapshots.
- Windows project-archive script excluding generated and sensitive files.
- Portfolio CSV preview and import with Polish and English headers.
- Portfolio monthly income, monthly expenses and average daily expense statistics.
- Portfolio category distribution bars.
- Inline editing of Portfolio transaction rows.
- Portfolio transaction filtering by type, tag and text.
- Custom bottom-navigation ordering stored in application preferences.
- Individual color selection for every bottom-navigation tab.
- Drag-and-drop navigation editor with touch-friendly move controls.
- Alcohol analytics module linked to Work beer counts and Portfolio expense tags.
- Historical drinking-day migration from the BrPW workbook for dates before native Work history.
- Historical monthly alcohol expenses through May 2026.
- Manual drinking-day overrides with one-click return to automatic Work data.
- Monthly alcohol history and overview statistics.
- Work time engine classifying session minutes as standard, additional or weekend time.
- Daily standard-hours score from 1 to 6 for weekdays from 2026-W31 onward.
- Weekly Work time analytics with category totals, average rating and best day.
- Cross-midnight and cross-weekend session splitting at calendar boundaries.
- Reusable accessible CollapsiblePanel component.
- Local persistence of collapsible panel state across browser reloads.
- Debt Management Foundation with five debts imported from the Minusy worksheet.
- Manual debt payments and current-balance updates with full event history.
- Debt data in Dexie schema v8, backup format v4 and cloud snapshots.

### Changed

- CHB now uses a local-first, cloud-synchronized data model instead of relying only on manual JSON transfers between devices.
- The header's former local-only indicator has been replaced by a live cloud-status control.
- Cloud synchronization timestamps and device metadata persist independently on every device.
- Local data writes now mark the cloud state as pending only after successful database operations.
- Upload and download operations now update the shared version baseline used for future comparisons.
- Application startup now inspects local and cloud fingerprints before choosing a safe automatic action.
- Reconnecting to the internet now triggers a fresh safe synchronization check.
- Manual upload and download remain available as explicit recovery and conflict-resolution controls.
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
- Editing the daily message target now recalculates the five-day and seven-day targets.
- Editing the seven-day target now recalculates the daily and five-day targets.
- Editing the five-day target now recalculates the daily and seven-day targets.
- Daily working-hours target remains independent from message-goal synchronization.
- Work-progress presentation now distinguishes goal completion from message-rate thresholds.
- Work summary now displays daily, five-day, seven-day and daily-hours targets together.
- Existing single weekly targets are interpreted as seven-day targets during migration and backup import.
- Work-rating presentation now uses the exact user-defined color scale instead of generic Tailwind colors.
- Ratings at or above 9.0 use the highest green rating color.
- Rating 8.5 remains the blue default rating.
- Every rating level from below 8.2 through above 9.0 now has a dedicated visual state.
- Work page now places active-week daily history before long-term weekly history.
- Active-week daily history and active-week summary are presented side by side on wide screens.
- Active-week summary and week settings move below daily history on smaller screens.
- Weekly progress is displayed below the active-week working area.
- Long-term week history is displayed below weekly progress.
- Financial plan remains at the bottom of the Work page.
- Work-page local-save status is integrated into the active-week header.
- Weekly summary cards are more compact and easier to scan.
- Weekly-history cards now use stronger metric hierarchy and separated metric cells.
- Weekly-history message totals use the application accent.
- Weekly-average ratings use the exact rating color scale.
- Zero beer count remains green and positive beer count remains red.
- Message-rate progress now uses one fixed scale ending at the permanent 1,976-message threshold.
- Dashboard now shows both synchronized weekly goals together with the fixed message-rate scale.
- Project documentation now exposes one vendor-neutral interface for current and future AI coding tools.
- Message-rate threshold status now shows the percentage remaining to the next threshold.
- Historical screenshot messages are stored as paid messages, while unavailable held and free message values default to zero.
- Historical sessions preserve total duration without claiming exact source start and end times.
- Portfolio transaction form now remembers the last selected tag.
- EnterTalkPro is selected automatically for income when no remembered income tag exists.
- Portfolio history uses a denser, scrollable table.
- Mobile navigation now uses the first four user-ordered tabs as primary items.
- Desktop bottom navigation scrolls horizontally when more tabs are added.
- Work active-week summary now presents data status, gross EUR and gross PLN in that order.
- Work week management no longer repeats the active week label and date range already represented in the page header and active-week panel.
- Gross PLN in the active-week summary is derived from gross EUR and the exchange rate assigned to the selected week.
- Work Time Analytics is the first and only panel migrated to the Global Panel System pilot.
- Work week settings, week history and financial plan now use the Global Panel System.
- Work week selector and create/delete actions are grouped under the week badge in the page header.
- Work history moved below the primary grid to reduce vertical fragmentation and improve laptop-width readability.

### Fixed

- Fixed production authentication failing when GitHub Actions did not receive the Supabase environment secrets.
- Fixed incorrect Supabase project URL configuration by requiring the project base URL instead of the REST endpoint.
- Fixed cloud synchronization time being lost after refreshing the page.
- Fixed automatic synchronization potentially clearing a newer local change made during an active upload.
- Fixed automatic upload running when the cloud was newer or when a conflict required manual resolution.
- Fixed first-device and second-device synchronization from silently overwriting unrelated versions.
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
- Fixed creation of incomplete `WorkWeekGoals` records after introducing the five-day target.
- Fixed inconsistent daily and weekly message goals.
- Fixed older work weeks missing the five-day goal after database migration.
- Fixed older JSON backups being rejected because of the missing five-day goal.
- Fixed goal values not remaining synchronized after changing the source field.
- Fixed goal presentation in the Work module showing only one weekly target.
- Fixed Dashboard rating colors relying on generic class-name detection.
- Fixed weekly-average ratings not using the same colors as daily ratings.
- Fixed message-rate progress resetting around each next threshold instead of using the full permanent scale.
- Fixed missing fixed 1,976-message goal presentation on Dashboard.
- Fixed active-week daily data requiring excessive scrolling on the Work page.
- Fixed long-term week history appearing before the active-week working area.
- Fixed cloud comparison crashing when a legacy snapshot did not contain Portfolio arrays.
- Fixed legacy cloud snapshots being fingerprinted before backward-compatible normalization.
- Fixed Portfolio snapshot migration by treating missing accounts, tags and transactions as empty collections.
- Fixed Portfolio CSV import result propagation through usePortfolio.
- Removed an unused Portfolio transaction type import that blocked TypeScript builds.
- Fixed React hook dependency warnings in Portfolio transaction form and history table.
- Fixed the Dexie restore transaction typing for the Alcohol backup tables by passing the table collection as an array.
- Concurrent Debt module initialization no longer attempts to insert the same five seed debts twice in React development mode.
- Debt seed marker and table-state checks now execute inside one Dexie transaction, preserving existing debt data and preventing ConstraintError failures.
- Debt initialization no longer stores a debt-seed-v1 marker in appSettings.
- Debt and historical-event seed records are added only when their stable IDs are missing, making initialization safe after reloads, HMR and partial imports.
- Removed debt-seed-v1 from AppSettingKey because it is no longer used.

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
