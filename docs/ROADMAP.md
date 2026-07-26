# CHB Roadmap

## Product direction

CHB is a personal, offline-first application designed to record and manage the user's real life.

The long-term product direction includes work, finances, debts, portfolio history, physical measurements, workouts, habits, personal goals, business activity and cross-module statistics.

The Dashboard serves as the central daily interface. Detailed module pages provide editing, history and advanced analysis.

## Current development line

Current completed sprint:

- v0.3.2C — Smart Goal Synchronization

Next planned sprint:

- v0.3.2D — Dashboard Control Center

Following planned sprint:

- v0.3.3 — Google Sheets Migration

## v0.1.x — Foundation

- [x] React
- [x] TypeScript
- [x] Vite
- [x] Git repository
- [x] GitHub remote
- [x] Oxlint
- [x] Prettier
- [x] Tailwind CSS
- [x] React Router
- [x] Import aliases
- [x] Initial documentation
- [x] Correct project-root repository structure

## v0.2.x — Application Shell

- [x] Desktop layout
- [x] Responsive mobile layout
- [x] Lucide icons
- [x] Dashboard overview
- [x] Shared page header
- [x] Shared metric card
- [x] Shared section card
- [x] Bottom tab navigation
- [x] Compact mobile navigation
- [x] Light and dark themes
- [x] Persistent theme preference
- [x] Theme toggle
- [x] CHB branding
- [x] Make the CHB header label navigate to the Dashboard
- [x] Align desktop bottom navigation tabs to the left
- [x] Dashboard visual refresh
- [x] Light-theme contrast pass
- [x] Dark-theme contrast pass
- [x] Shared notice styles
- [x] Shared panel styles
- [ ] Shared empty state
- [ ] Shared button system
- [ ] Error route
- [ ] Not-found page
- [ ] Centralized application version display
- [ ] Additional visual refinements based on long-term usage

## v0.3.x — Work Module

### Requirements and calculations

- [x] Work module requirements
- [x] Current work-week interface
- [x] Weekly earnings calculation
- [x] Message-rate thresholds
- [x] Held-message earnings
- [x] Payout-fee thresholds
- [x] EUR-to-PLN calculation
- [x] Daily work statistics
- [x] Weekly financial plan
- [x] Work-rating presentation
- [x] Alcohol-count presentation
- [x] Shared work-goal synchronization engine
- [x] Daily-to-weekly goal calculation
- [x] Seven-day-to-daily goal calculation
- [x] Five-day-to-daily goal calculation
- [x] Goal-value rounding to two decimal places

### Editing

- [x] Editable work days
- [x] Editable message counts
- [x] Editable work ratings
- [x] Editable beer counts
- [x] Editable work sessions
- [x] Adding work sessions
- [x] Removing work sessions
- [x] Editable held-message count
- [x] Editable EUR/PLN exchange rate
- [x] Editable weekly financial plan
- [x] Adding financial goals
- [x] Removing financial goals
- [x] Editing financial-goal names
- [x] Editing financial-goal amounts
- [x] Editable daily message target
- [x] Editable seven-day message target
- [x] Editable five-day message target
- [x] Editable independent daily-hours target

### Data layer

- [x] Dexie dependency
- [x] Dexie React hooks
- [x] Versioned work database schema
- [x] Persistent work weeks
- [x] Reactive database queries
- [x] Transaction-based week updates
- [x] Automatic initial-data seeding
- [x] ISO creation and update timestamps
- [x] Shared reactive data between Dashboard and Work module
- [x] Dexie schema version 2
- [x] Dexie schema version 3
- [x] Dexie schema version 4
- [x] Application settings table
- [x] Active-work-week persistence
- [x] Existing-data migration
- [x] Existing financial-plan priority migration
- [x] Existing work-goal synchronization migration
- [x] Unique ISO week protection
- [ ] Full data-integrity validation
- [ ] Recovery from corrupted work records
- [ ] Database health diagnostics

### Goals and daily workflow

- [x] Weekly-goal data model
- [x] Editable daily message target
- [x] Editable seven-day message target
- [x] Editable five-day message target
- [x] Editable daily hours target
- [x] Automatic current-day detection
- [x] Current-day summary
- [x] Quick message editing from Dashboard
- [x] Quick work-session creation from Dashboard
- [x] Quick rating editing from Dashboard
- [x] Quick beer-count editing from Dashboard
- [x] Weekly summary on Dashboard
- [x] Goal progress on Dashboard
- [x] Work-threshold progress on Dashboard
- [x] Daily message goal automatically updates both weekly goals
- [x] Seven-day message goal automatically updates daily and five-day goals
- [x] Five-day message goal automatically updates daily and seven-day goals
- [x] Daily-hours target remains independent
- [x] Immediate synchronized goal preview before saving
- [x] Synchronized goal values preserved after page refresh
- [x] Synchronized goal values preserved independently for every week
- [x] Separate five-day and seven-day progress on the Work page
- [x] Combined goal summary on the Work page
- [ ] Remaining daily message target
- [ ] Remaining weekly message target
- [ ] Required daily pace based on remaining days
- [ ] Quick removal of work sessions from Dashboard
- [ ] One-click work-session timer
- [ ] Configurable default work rating
- [ ] Configurable default exchange rate
- [ ] Configurable default goals

### Financial goals

- [x] Priority-based financial goals
- [x] Sequential financial allocation
- [x] Individual financial-goal completion percentage
- [x] Financial-goal completion indicators
- [x] Financial-goal ordering controls
- [x] Financial-goal locking
- [x] Financial-goal unlocking
- [x] Safe financial-goal removal
- [x] New goals added at the end of the priority list
- [x] Automatic priority renumbering
- [x] Existing-plan priority migration
- [x] Financial priorities copied to new weeks
- [x] Financial lock states copied to new weeks
- [x] Financial progress displayed on Dashboard
- [ ] Optional drag-and-drop ordering
- [ ] Reusable financial-allocation engine for the Debts module
- [ ] Financial-goal templates
- [ ] Copy selected goals between weeks
- [ ] Archive completed financial goals

### Week management

- [x] Creating new weeks
- [x] Automatic ISO week number proposal
- [x] Automatic Monday-to-Sunday date range
- [x] Selecting an active week
- [x] Persistent active-week selection
- [x] Protection against duplicate ISO weeks
- [x] Copying exchange rate from selected week
- [x] Copying synchronized goals from selected week
- [x] Copying financial plan from selected week
- [x] Empty daily records for new weeks
- [x] Weekly-history view
- [x] Grouping history by year
- [x] Newest-to-oldest week sorting
- [x] Active-week history-card indicator
- [x] Weekly summary metrics in history
- [x] Reusable shared history-card component
- [x] Deleting weeks
- [x] Strong work-week deletion confirmation
- [x] Protection against deleting the last week
- [x] Automatic active-week recovery after deletion
- [ ] Grouping history by month
- [ ] Year filter
- [ ] Month filter
- [ ] History search
- [ ] Week-close workflow
- [ ] Automatic next-week creation
- [ ] Importing historical weeks from Google Sheets

### Statistics

- [ ] Weekly work statistics
- [ ] Monthly work statistics
- [ ] Yearly work statistics
- [ ] Message charts
- [ ] Worked-hours charts
- [ ] Hourly-performance charts
- [ ] Earnings charts
- [ ] Rating charts
- [ ] Alcohol-count statistics
- [ ] Daily-goal completion statistics
- [ ] Weekly-goal completion statistics

## v0.3.2A — UX & Visual Refresh

- [x] Clickable CHB Dashboard link
- [x] Left-aligned desktop bottom navigation
- [x] Compact application header
- [x] Dashboard layout redesign
- [x] Reduced Dashboard scrolling
- [x] Stronger daily-metric hierarchy
- [x] Grouped Dashboard quick actions
- [x] Compact weekly summary
- [x] Financial-plan visual redesign
- [x] Improved light-theme contrast
- [x] Improved dark-theme contrast
- [x] Shared notice styles
- [x] Improved Settings backup presentation
- [x] Improved theme toggle

## v0.3.2B — Smart Financial Goals

- [x] Editable financial goals
- [x] Add financial goals
- [x] Remove financial goals
- [x] Priority-based financial goals
- [x] Sequential financial allocation
- [x] Financial-goal completion percentage
- [x] Financial-goal ordering controls
- [x] Financial-goal locking
- [x] Financial-goal unlocking
- [x] Automatic priority normalization
- [x] Existing-plan priority migration
- [x] Smart financial Dashboard
- [x] Strong work-week deletion confirmation
- [x] Delete work week
- [x] Automatic active-week recovery
- [x] Backward-compatible financial-goal backup import

## v0.3.2C — Smart Goal Synchronization

- [x] Daily message goal updates the seven-day goal automatically
- [x] Daily message goal updates the five-day goal automatically
- [x] Seven-day goal updates the daily goal automatically
- [x] Seven-day goal updates the five-day goal automatically
- [x] Five-day goal updates the daily goal automatically
- [x] Five-day goal updates the seven-day goal automatically
- [x] Manual daily-hours target remains independent
- [x] Shared synchronization rules on Dashboard and Work page
- [x] Goal recalculation without temporary inconsistent saved states
- [x] Goal synchronization preserved in backup and restore
- [x] Backward-compatible import of older goal records
- [x] Dexie version 4 migration
- [x] Validation for empty and non-negative values
- [x] Decimal goal-value support
- [x] Mobile-friendly goal editing
- [x] Separate five-day and seven-day progress indicators
- [x] Synchronized goal summary on Work page
- [x] Updated tests and documentation

## v0.3.2D — Dashboard Control Center

- [ ] Remaining messages today
- [ ] Remaining messages for the five-day target
- [ ] Remaining messages for the seven-day target
- [ ] Remaining hours today
- [ ] Required average messages per remaining hour
- [ ] Required daily pace based on remaining calendar days
- [ ] Required daily pace based on remaining five-day work period
- [ ] Ahead-of-plan and behind-plan indicators
- [ ] Improved current-day status presentation
- [ ] Improved weekly status presentation
- [ ] Quick editing of the most frequently used values
- [ ] Compact history of recent work blocks
- [ ] Quick removal of work sessions from Dashboard
- [ ] Further reduction of unnecessary scrolling
- [ ] Consistent goal calculations between Dashboard and Work page

## v0.3.3 — Google Sheets Migration

- [ ] Define historical import format
- [ ] Import work history from week 8 of 2026
- [ ] Import preview
- [ ] Duplicate detection
- [ ] ISO week validation
- [ ] Date validation
- [ ] Numeric-value validation
- [ ] Financial-plan validation
- [ ] Work-goal normalization during import
- [ ] Partial import
- [ ] Batch import
- [ ] Import result report
- [ ] Restore point before import
- [ ] Verify imported weeks against the original spreadsheet

## v0.4.x — Backup and Data Safety

- [x] Complete JSON export
- [x] Complete JSON import
- [x] Backup-file validation
- [x] Backup preview
- [x] Confirmation before replacing data
- [x] Last-backup timestamp
- [x] Transaction-based database replacement
- [x] Active-week recovery during import
- [x] Backward-compatible financial-goal backup import
- [x] Backward-compatible synchronized-goal backup import
- [ ] Automatic backup reminders
- [ ] Selective module export
- [ ] Local backup history
- [ ] Data-reset workflow
- [ ] Encrypted backup files
- [ ] Backup schema migration framework

## v0.5.x — Expenses Module

- [ ] Expense model
- [ ] Expense entries
- [ ] Categories
- [ ] Payment methods
- [ ] Recurring expenses
- [ ] Monthly summaries
- [ ] Expense statistics
- [ ] Persistent expense storage
- [ ] Dashboard expense summary
- [ ] Dashboard quick expense entry

## v0.6.x — Debts Module

- [ ] Debt model
- [ ] Debt entries
- [ ] Repayment history
- [ ] Payment schedules
- [ ] Remaining-balance calculations
- [ ] Debt statistics
- [ ] Persistent debt storage
- [ ] Dashboard debt summary
- [ ] Dashboard quick repayment entry
- [ ] Reuse financial-priority allocation logic for repayments

## v0.7.x — Portfolio Module

- [ ] Portfolio model
- [ ] Accounts
- [ ] Cash balances
- [ ] Currencies
- [ ] Assets
- [ ] Portfolio snapshots
- [ ] Portfolio history
- [ ] Portfolio statistics
- [ ] Persistent portfolio storage
- [ ] Dashboard portfolio summary

## v0.8.x — Health and Training

- [ ] Body-weight measurements
- [ ] Body measurements
- [ ] Measurement history
- [ ] Workout entries
- [ ] Exercise library
- [ ] Training plans
- [ ] Training statistics
- [ ] Weight charts
- [ ] Measurement charts
- [ ] Hydration tracking
- [ ] Habit tracking

## v0.9.x — Cross-module Statistics

- [ ] Shared date filters
- [ ] Work and finance comparisons
- [ ] Support-for-mother statistics
- [ ] Payment-day statistics
- [ ] Debt-repayment statistics
- [ ] Portfolio history
- [ ] Health and work comparisons
- [ ] Dashboard trend cards
- [ ] Cross-module charts

## Future business module

- [ ] Esoteric-service revenue
- [ ] Clients
- [ ] Orders
- [ ] Service costs
- [ ] Business goals
- [ ] Business statistics
- [ ] Business Dashboard summary

## Future synchronization and distribution

- [ ] PWA manifest
- [ ] Service worker
- [ ] Offline application shell
- [ ] Installable Android application
- [ ] Installable Windows application
- [ ] Installable Linux application
- [x] GitHub Pages deployment
- [x] Automated deployment
- [x] Production build for repository subpath
- [x] Static-hosting-compatible routing
- [ ] Synchronization requirements
- [ ] Conflict-resolution strategy
- [ ] Optional cloud provider
- [ ] Cross-device authentication
- [ ] Encrypted remote backup
- [ ] Private deployment strategy
- [ ] Access control for future sensitive remote data

## v1.0.0 — Stable Release

- [ ] Stable Work module
- [ ] Stable Expenses module
- [ ] Stable Debts module
- [ ] Stable Portfolio module
- [ ] Stable Health module
- [ ] Stable Statistics module
- [ ] Reliable backup and restore
- [ ] Cross-device installation
- [ ] Production deployment
- [ ] Production documentation