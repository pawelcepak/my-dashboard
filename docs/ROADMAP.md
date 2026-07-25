# My Dashboard Roadmap

## Product direction

My Dashboard is a personal, offline-first application designed to manage work, expenses, debts, portfolio information and cross-module statistics.

The application is developed incrementally. Each module owns its business logic while shared infrastructure provides navigation, storage, presentation and future synchronization.

The Dashboard serves as the central daily interface. Module pages provide detailed editing, history and advanced statistics.

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
- [x] Sidebar navigation
- [x] Lucide icons
- [x] Dashboard overview
- [x] Shared page header
- [x] Shared metric card
- [x] Shared section card
- [ ] Shared empty state
- [ ] Shared button system
- [ ] Error route
- [ ] Not-found page
- [ ] Light and dark theme support
- [ ] Centralized application version display

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

### Data layer

- [x] Dexie dependency
- [x] Dexie React hooks
- [x] Versioned work database schema
- [x] Persistent current work week
- [x] Reactive database queries
- [x] Transaction-based week updates
- [x] Automatic initial-data seeding
- [x] ISO creation and update timestamps
- [x] Shared reactive data between Dashboard and Work module
- [ ] Database migrations beyond schema version 1
- [ ] Data-integrity validation
- [ ] Recovery from corrupted work records

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
- [x] Quick financial-plan editing from Dashboard
- [x] Weekly summary on Dashboard
- [x] Goal progress on Dashboard
- [x] Work-threshold progress on Dashboard
- [ ] Quick removal of work sessions from Dashboard
- [ ] One-click work-session timer
- [ ] Configurable default work rating
- [ ] Configurable default exchange rate
- [ ] Configurable default goals

### Week management

- [ ] Creating new weeks
- [ ] Automatic ISO week number
- [ ] Automatic week date range
- [ ] Weekly history
- [ ] Selecting an active week
- [ ] Editing previous weeks
- [ ] Deleting weeks
- [ ] Duplicating selected week settings
- [ ] Week-close workflow
- [ ] Automatic creation of the next week
- [ ] Protection against duplicate ISO weeks

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

## v0.4.x — Expenses Module

- [ ] Expense model
- [ ] Expense entries
- [ ] Categories
- [ ] Payment methods
- [ ] Recurring expenses
- [ ] Monthly summaries
- [ ] Expense statistics
- [ ] Expense charts
- [ ] Persistent expense storage
- [ ] Dashboard expense summary
- [ ] Dashboard quick expense entry

## v0.5.x — Debts Module

- [ ] Debt model
- [ ] Debt entries
- [ ] Repayment history
- [ ] Payment schedules
- [ ] Remaining-balance calculations
- [ ] Debt statistics
- [ ] Debt charts
- [ ] Persistent debt storage
- [ ] Dashboard debt summary
- [ ] Dashboard quick repayment entry

## v0.6.x — Portfolio Module

- [ ] Portfolio model
- [ ] Accounts
- [ ] Cash balances
- [ ] Currencies
- [ ] Assets
- [ ] Portfolio history
- [ ] Portfolio statistics
- [ ] Persistent portfolio storage
- [ ] Dashboard portfolio summary

## v0.7.x — Cross-module Statistics

- [ ] Shared date filters
- [ ] Work and finance comparisons
- [ ] Support-for-mother statistics
- [ ] Payment-day statistics
- [ ] Debt-repayment statistics
- [ ] Portfolio history
- [ ] Dashboard trend cards
- [ ] Cross-module charts

## v0.8.x — Data Management

- [ ] Database migration strategy
- [ ] JSON export
- [ ] JSON import
- [ ] Backup validation
- [ ] Backup preview
- [ ] Selective module export
- [ ] Selective module import
- [ ] Local backup history
- [ ] Data-reset workflow

## v0.9.x — Application Distribution

- [ ] PWA manifest
- [ ] Service worker
- [ ] Offline application shell
- [ ] Installable Android application
- [ ] Installable Windows application
- [ ] Installable Linux application
- [ ] GitHub Pages deployment
- [ ] Automated GitHub Actions deployment
- [ ] Deployment documentation

## Future synchronization

- [ ] Synchronization requirements
- [ ] Conflict-resolution strategy
- [ ] Optional cloud provider
- [ ] Cross-device authentication
- [ ] Encrypted remote backup
- [ ] Synchronization-status interface

## v1.0.0 — Stable Release

- [ ] Stable Work module
- [ ] Stable Expenses module
- [ ] Stable Debts module
- [ ] Stable Portfolio module
- [ ] Stable Statistics module
- [ ] Reliable backup and restore
- [ ] Cross-device installation
- [ ] Production deployment
- [ ] Production documentation
