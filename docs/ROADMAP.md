# CHB Roadmap

## Product direction

CHB is a personal, offline-first application designed to record and manage the user's real life.

The long-term product direction includes work, finances, debts, portfolio history, physical measurements, workouts, habits, personal goals, business activity and cross-module statistics.

The Dashboard serves as the central daily interface. Detailed module pages provide editing, history and advanced analysis.

## Current development line

Current completed sprint:

- v0.3.2B — Smart Financial Goals

Next planned sprint:

- v0.3.2C — Smart Goal Synchronization

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
- [x] Application settings table
- [x] Active-work-week persistence
- [x] Existing-data migration
- [x] Existing financial-plan priority migration
- [x] Unique ISO week protection
- [ ] Full data-integrity validation
- [ ] Recovery from corrupted work records
- [ ] Database health diagnostics

### Goals and daily workflow

- [x] Weekly-goal data model
- [x] Editable daily message target
- [x] Editable weekly message target
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
- [ ] Daily-message target automatically updates weekly target
- [ ] Weekly-message target automatically updates daily target
- [ ] Define the number of planned work days used for goal synchronization
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
- [x] Copying goals from selected week
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

## v0.3.2C — Smart Goal Synchronization

- [ ] Daily message goal updates the weekly message goal automatically
- [ ] Weekly message goal updates the daily message goal automatically
- [ ] Manual daily-hours target remains independent
- [ ] Clear indication of which goal was edited last
- [ ] Consistent calculation rules on Dashboard and Work page
- [ ] Goal recalculation without temporary inconsistent states
- [ ] Goal synchronization preserved in backup and restore
- [ ] Validation for zero, empty and decimal values
- [ ] Mobile-friendly goal editing
- [ ] Updated tests and documentation

## v0.3.2D — Dashboard Control Center

- [ ] Remaining messages today
- [ ] Remaining messages this week
- [ ] Remaining hours today
- [ ] Required average messages per remaining hour
- [ ] Required daily pace based on remaining work days
- [ ] Improved current-day status presentation
- [ ] Improved weekly status presentation
- [ ] Quick editing of the most frequently used values
- [ ] Compact history of recent work blocks
- [ ] Further reduction of unnecessary scrolling

## v0.3.3 — Google Sheets Migration

- [ ] Define historical import format
- [ ] Import work history from week 8 of 2026
- [ ] Import preview
- [ ] Duplicate detection
- [ ] ISO week validation
- [ ] Date validation
- [ ] Numeric-value validation
- [ ] Partial import
- [ ] Batch import
- [ ] Import result report
- [ ] Restore point before import

## v0.4.x — Backup and Data Safety

- [x] Complete JSON export
- [x] Complete JSON import
- [x] Backup-file validation
- [x] Backup preview
- [x] Confirmation before replacing data
- [x] Last-backup timestamp
- [x] Transaction-based database replacement
- [x] Active-week recovery during import
- [x] Backward-compatible backup import
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