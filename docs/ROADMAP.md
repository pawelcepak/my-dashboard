# CHB Roadmap

## Product direction

CHB is a personal, offline-first application designed to record and manage the user's real life.

The long-term product direction includes work, finances, debts, portfolio history, physical measurements, workouts, habits, personal goals, business activity and cross-module statistics.

The Dashboard serves as the central daily interface. Detailed module pages provide editing, history and advanced analysis.

## Current development line

Current completed cloud milestone:

- v0.4.1F — Automatic Cloud Sync

Current stable working state:

- Offline-first Dexie storage
- Private Supabase authentication
- Automatic PC and laptop synchronization
- Safe startup upload and download
- Conflict detection and manual conflict resolution
- Manual JSON backup and restore
- Automated GitHub Pages deployment

Next optional product sprint:

- v0.3.2D — Dashboard Control Center

Following planned sprint:

- v0.3.3 — Google Sheets Migration

Future quality and intelligence work remains planned but is not required for normal daily use.

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
- [ ] Production bundle code splitting
- [ ] Lazy loading for application modules

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
- [x] Full message-rate scale from 0 to 1,976 messages
- [x] Fixed threshold markers for 776, 1,576 and 1,976 messages
- [x] Current-message position on the full threshold scale
- [x] Current-rate presentation
- [x] Next-threshold calculation
- [x] Messages-missing calculation

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
- [x] Five-day goal visible on Dashboard
- [x] Seven-day goal visible on Dashboard
- [x] Fixed 1,976-message target visible on Dashboard
- [ ] Remaining daily message target
- [ ] Remaining weekly message target
- [ ] Required daily pace based on remaining days
- [ ] Quick removal of work sessions from Dashboard
- [ ] One-click work-session timer
- [ ] Configurable default work rating
- [ ] Configurable default exchange rate
- [ ] Configurable default goals

### Work-rating presentation

- [x] Decimal work-rating values
- [x] Default 8.5 rating
- [x] Dedicated color for ratings above 9.0
- [x] Dedicated color for rating 9.0
- [x] Dedicated color for rating 8.9
- [x] Dedicated color for rating 8.8
- [x] Dedicated color for rating 8.7
- [x] Dedicated color for rating 8.6
- [x] Blue default color for rating 8.5
- [x] Dedicated color for rating 8.4
- [x] Dedicated color for rating 8.3
- [x] Dedicated color for rating 8.2
- [x] Dedicated color for ratings below 8.2
- [x] Consistent rating colors on Dashboard
- [x] Consistent rating colors in daily history
- [x] Consistent rating colors in weekly history
- [x] Consistent rating colors on mobile
- [x] Weekly-average rating color

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
- [x] Weekly-history block count
- [x] Weekly-average rating presentation
- [x] Redesigned weekly-history cards
- [ ] Grouping history by month
- [ ] Year filter
- [ ] Month filter
- [ ] History search
- [ ] Week-close workflow
- [ ] Automatic next-week creation
- [ ] Importing historical weeks from Google Sheets

### Work-page usability

- [x] Active-week header
- [x] Integrated local-save status
- [x] Active-week daily history shown near the top
- [x] Active-week daily history on the left side
- [x] Active-week summary on the right side
- [x] Week settings grouped with active-week summary
- [x] Responsive single-column layout on smaller screens
- [x] Weekly progress below the active-week working area
- [x] Long-term weekly history below weekly progress
- [x] Financial plan at the bottom
- [x] Reduced scrolling before daily editing
- [x] Compact active-week summary cards
- [x] Improved active-week visual hierarchy
- [ ] Sticky daily-history header
- [ ] Optional compact daily-history density
- [ ] Keyboard navigation between days
- [ ] Faster inline daily editing

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

## Post-v0.3.2C — Work and Dashboard Visual Refinement

- [x] Exact user-defined work-rating colors
- [x] Consistent rating colors across the application
- [x] Shared full message-rate threshold bar
- [x] Fixed 1,976-message maximum threshold
- [x] Threshold markers for 776, 1,576 and 1,976
- [x] Current-message position indicator
- [x] Current-rate presentation
- [x] Next-threshold presentation
- [x] Message-rate bar on Work page
- [x] Message-rate bar on Dashboard
- [x] Simultaneous five-day and seven-day goals on Dashboard
- [x] Fixed 1,976-message target on Dashboard
- [x] Active-week daily history moved near the top
- [x] Active-week summary moved next to daily history
- [x] Weekly progress moved below active-week content
- [x] Long-term history moved below weekly progress
- [x] Financial plan remains last
- [x] Redesigned weekly-history cards
- [x] Weekly block count
- [x] Weekly-average rating color
- [x] Improved mobile history layout
- [x] Improved light-theme and dark-theme readability

## v0.3.2D — Dashboard Control Center

- [ ] Remaining messages today
- [ ] Remaining messages for the five-day target
- [ ] Remaining messages for the seven-day target
- [ ] Remaining messages for the fixed 1,976-message threshold
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
- [ ] Dashboard backup-status indicator
- [ ] Dashboard active-database status
- [ ] Dashboard quick access to weekly settings

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

## v0.4.1 — Private Cloud and Cross-device Synchronization

### v0.4.1A — Supabase Foundation

- [x] Install Supabase JavaScript client
- [x] Vite environment-variable configuration
- [x] Private single-user authentication
- [x] Persistent login session
- [x] Login screen
- [x] Logout control
- [x] Protected application layout
- [x] Disabled public account registration
- [x] GitHub Actions Supabase secrets
- [x] Production authentication on GitHub Pages

### v0.4.1B — Cloud Status

- [x] Live cloud-status indicator in the header
- [x] Online and offline detection
- [x] Supabase connection verification
- [x] Expandable cloud-status panel
- [x] Account information
- [x] Device information
- [x] Last connection-check timestamp
- [x] Last synchronization timestamp
- [x] Manual connection check
- [x] Local-database status presentation

### v0.4.1C — Cloud Snapshot Sync

- [x] Complete local Dexie snapshot generation
- [x] Private Supabase snapshot upload
- [x] Private Supabase snapshot download
- [x] One snapshot per authenticated user
- [x] RLS-protected cloud record
- [x] Cloud snapshot timestamp
- [x] Manual upload
- [x] Manual download
- [x] Strong confirmation before replacement
- [x] Existing CHB backup validation reused for cloud restore
- [x] Transaction-based cloud restore
- [x] Manual recovery controls remain available

### v0.4.1D — Safe Version Comparison

- [x] Stable local-data fingerprint
- [x] Stable cloud-data fingerprint
- [x] Ignore non-content backup timestamps during comparison
- [x] Detect empty cloud
- [x] Detect synchronized versions
- [x] Detect local changes
- [x] Detect newer cloud data
- [x] Detect two-sided conflict
- [x] Manual local-version selection
- [x] Manual cloud-version selection
- [x] No silent overwrite during conflict
- [x] Per-device synchronization baseline

### v0.4.1E — Cloud Architecture Refactor

- [x] CloudProvider limited primarily to React state orchestration
- [x] Dedicated cloud snapshot service
- [x] Dedicated cloud comparison service
- [x] Dedicated cloud metadata service
- [x] Dedicated cloud synchronization service
- [x] Dedicated cloud fingerprint utility
- [x] Persistent synchronization metadata in local storage
- [x] Device-name detection
- [x] Modular foundation for future application modules
- [x] Safe version comparison preserved after refactor

### v0.4.1F — Automatic Cloud Sync

- [x] Persistent dirty-state tracker
- [x] Dirty revision counter
- [x] Dirty timestamp
- [x] Dirty tracking after successful work-data writes
- [x] Dirty tracking for week creation
- [x] Dirty tracking for week deletion
- [x] Dirty tracking for week reset
- [x] Dirty tracking for active-week selection
- [x] Revision-safe dirty-state clearing
- [x] Debounced automatic upload
- [x] 2.5-second quiet period before upload
- [x] Avoid duplicate uploads during rapid edits
- [x] Preserve edits made during an active upload
- [x] Automatic retry after internet recovery
- [x] Automatic startup inspection
- [x] Automatic upload when local data is unambiguously newer
- [x] Automatic upload when the cloud is empty
- [x] Automatic download when cloud data is unambiguously newer
- [x] No automatic action when versions are equal
- [x] No automatic overwrite during conflict
- [x] Offline local work remains available
- [x] Manual upload and download remain available
- [x] Ready for normal PC and Linux-laptop workflow

### Future cloud improvements

- [ ] Synchronization activity history
- [ ] Named custom devices
- [ ] Pending-change counter
- [ ] Record-level change queue
- [ ] Changed-field summary
- [ ] Selective module synchronization
- [ ] Cloud snapshot history
- [ ] Restore a previous cloud snapshot
- [ ] Encrypted cloud payload
- [ ] Background synchronization for an installed PWA
- [ ] Additional conflict-difference preview
- [ ] Cloud diagnostics page

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

## Future Quality Pass — Visual Density and Daily Usability

### General quality

- [ ] Shared empty-state system
- [ ] Shared button system
- [ ] Error route
- [ ] Not-found page
- [ ] Centralized application version display
- [ ] Consistent loading states
- [ ] Consistent confirmation dialogs
- [ ] Keyboard accessibility review
- [ ] Responsive-layout review
- [ ] Light-theme contrast review
- [ ] Dark-theme contrast review
- [ ] Production bundle code splitting
- [ ] Lazy loading for application modules
- [ ] Animation and transition consistency
- [ ] Long-term usability review based on real daily work

### Work performance indicators

- [ ] Green upward indicator for average performance at or above 43.0 messages/hour
- [ ] Yellow neutral indicator for average performance from 36.0 to below 43.0 messages/hour
- [ ] Red downward indicator for average performance below 36.0 messages/hour
- [ ] Consistent messages-per-hour indicators on Dashboard
- [ ] Consistent messages-per-hour indicators on Work page
- [ ] Consistent messages-per-hour indicators in daily history
- [ ] Consistent messages-per-hour indicators in weekly history
- [ ] Consistent messages-per-hour indicators in future statistics

### Work-page layout refinement

- [ ] Three-column wide-screen Work layout
- [ ] Approximately 40% active-week daily history
- [ ] Approximately 30% active-week summary
- [ ] Approximately 30% long-term week history
- [ ] Keep all three areas visible on 1920×1080 displays
- [ ] Compact spreadsheet-like daily-history density
- [ ] Content-sized columns for date, beers, rating, held messages, messages, hours, average and blocks
- [ ] Reduced unnecessary horizontal spacing
- [ ] Held-message count displayed between rating and regular messages
- [ ] Individual weekly EUR/PLN rate retained
- [ ] Weekly EUR/PLN rate integrated visually into the active-week panel
- [ ] Improved weekly-settings panel styling
- [ ] Faster daily scanning during normal work

## Future Daily Goals and Reminder System

### Goal management

- [ ] Daily-goal data model
- [ ] Default morning goal
- [ ] Default evening goal
- [ ] Default work goal
- [ ] Default Czech-study goal
- [ ] Default training goal
- [ ] Add custom daily goals
- [ ] Rename daily goals
- [ ] Reorder daily goals
- [ ] Lock daily goals
- [ ] Unlock daily goals
- [ ] Remove unlocked daily goals
- [ ] Mark goals as completed
- [ ] Daily completion history
- [ ] Per-day notes

### Reminder workflow

- [ ] Morning reminder around 10:00
- [ ] Evening reminder around 22:00
- [ ] Show an overdue reminder after the next login
- [ ] Catch up missing evening entries
- [ ] Catch up missing weekend entries
- [ ] Detect a long period without opening CHB
- [ ] Review missed days after returning
- [ ] Configurable reminder behavior
- [ ] Browser notification support
- [ ] Installed-PWA notification support

### Completion statistics

- [ ] Completed-versus-expected presentation such as 3/10
- [ ] Red completion state below 50%
- [ ] Yellow completion state from 51% to 85%
- [ ] Green completion state from 86% to 100%
- [ ] Goal-specific completion percentage
- [ ] Morning-routine statistics
- [ ] Evening-routine statistics
- [ ] Work-goal statistics
- [ ] Czech-study statistics
- [ ] Training statistics
- [ ] Weekly and monthly consistency
- [ ] Streak tracking

## v0.9.x — CHB Intelligence

### Daily and weekly insights

- [ ] Daily Insight
- [ ] Weekly Insight
- [ ] Comparison with the previous week
- [ ] Comparison with four-week average
- [ ] Comparison with eight-week average
- [ ] Best result detection
- [ ] Personal-record detection
- [ ] Streak detection
- [ ] Goal-arrival estimate
- [ ] Fixed-threshold arrival estimate
- [ ] Predicted weekly earnings
- [ ] Predicted weekly result
- [ ] Ahead-of-plan and behind-plan explanation

### CHB Coach

- [ ] Data-driven coaching without generic motivational quotes
- [ ] Best working-hour detection
- [ ] Best weekday detection
- [ ] Relationship between work duration and rating
- [ ] Relationship between working hours and messages per hour
- [ ] Relationship between alcohol count and work outcomes when supported by data
- [ ] Detection of sustainable performance ranges
- [ ] Calm contextual feedback on weaker days
- [ ] Positive progress framing based on historical evidence
- [ ] Only show conclusions supported by sufficient personal data

### Trends and predictions

- [ ] Four-week trends
- [ ] Eight-week trends
- [ ] Monthly trends
- [ ] Yearly trends
- [ ] Performance-growth rate
- [ ] Performance-decline rate
- [ ] Earnings forecast
- [ ] Goal-completion forecast
- [ ] Record-probability estimate
- [ ] Confidence indicators for predictions

### CHB Timeline

- [ ] Personal achievement timeline
- [ ] Weekly record markers
- [ ] Earnings-record markers
- [ ] Rating-record markers
- [ ] Performance-record markers
- [ ] Longest-streak markers
- [ ] First fixed-threshold achievement
- [ ] Major debt-repayment milestones
- [ ] Portfolio milestones
- [ ] Health and training milestones
- [ ] First cloud synchronization milestone
- [ ] First backup milestone

### Cross-module intelligence

- [ ] Expenses Intelligence
- [ ] Debts Intelligence
- [ ] Portfolio Intelligence
- [ ] Health Intelligence
- [ ] Daily-goal consistency insights
- [ ] Work and health relationships
- [ ] Work and spending relationships
- [ ] Debt-repayment forecasts
- [ ] Personal recommendations based only on recorded data

## Future Cross-module Statistics

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

## v0.5.4 — Developer Infrastructure

### v0.5.4A-D — Documentation foundation

- [x] Machine-readable project data foundation
- [x] Project-data validation and consistency checks
- [x] Deterministic CHANGELOG and ROADMAP generator
- [x] Automated release preparation command

### v0.5.4E-F — AI Project Interface

- [x] Machine-readable module registry
- [x] Machine-readable known-issue registry
- [x] Vendor-neutral AI Project Interface manifest
- [x] Generated AGENTS.md adapter
- [x] Generated CLAUDE.md adapter
- [x] Generated Cursor project rules

## v0.5.5 — Work UX Improvements

- [x] Current-time defaults for new work sessions
- [x] Two-minute default duration for new work sessions
- [x] Remaining percentage for the next message-rate threshold

## v0.5.6 — Historical Work Import

- [x] Import 2026 work history for ISO weeks 8–29
- [x] Preserve existing weeks during historical import
- [x] Validate imported weekly message and beer totals against source screenshots
- [x] Preserve historical daily duration with identifiable placeholder sessions

## v0.6.0 — Portfolio Foundation

- [x] Functional income and expense ledger
- [x] Automatic running balance
- [x] Editable Portfolio tags
- [x] Optional transaction notes
- [x] Multiple transactions on one date
- [x] Portfolio backup and cloud synchronization
- [x] Safe Windows project ZIP script

## v0.6.0a — Cloud Compatibility Hotfix

- [x] Normalize legacy cloud snapshots without Portfolio arrays
- [x] Make cloud fingerprint and timestamp comparison safe for legacy snapshots

## v0.6.1 — Portfolio UX

- [x] Fast Portfolio entry with remembered tags and Enter submission
- [x] Compact filtered transaction table with inline editing
- [x] Monthly and category Portfolio statistics
- [x] Portfolio CSV preview and import

## v0.6.1a — Portfolio UX Hotfix

- [x] Fix Portfolio UX TypeScript build errors
- [x] Remove Portfolio React hook dependency warnings

## v0.6.2 — Customizable Bottom Navigation

- [x] Store navigation order and tab colors in application preferences
- [x] Manage tab order and colors without code
- [x] Reorder tabs by drag and touch-friendly controls
- [x] Adapt desktop and mobile bars to the configured order

## v0.6.3A — Work UX Cleanup

- [x] Show Work data status, gross EUR and gross PLN in one ordered strip
- [x] Remove duplicated active-week label and date range from the week manager

## v0.7.0 — Alcohol Analytics

- [x] Derive drinking days and beer totals from Work
- [x] Derive alcohol expenses from selected Portfolio tags
- [x] Import historical BrPW drinking days and monthly expenses
- [x] Support manual day corrections without duplicating Work data
- [x] Add calendar, monthly history and overview statistics

## v0.7.1 — Alcohol Analytics Advanced

- [ ] Add monthly drinking-day, beer-count and expense charts
- [ ] Add month-to-month and year-to-year comparisons
- [ ] Add average beers, cost per drinking day and estimated cost per beer
- [ ] Add weekday distribution, longest drinking streak and longest break

## v0.7.2 — Alcohol Intelligence

- [ ] Analyze relationships between beer count and daily rating
- [ ] Analyze relationships between beer count and messages or messages per hour
- [ ] Analyze relationships between beer count and earnings
- [ ] Add historical records, trends and change detection

## v0.7.3 — Alcohol Dashboard Integration

- [ ] Add an Alcohol widget to Dashboard
- [ ] Show the last drinking day and days since it
- [ ] Show current-month drinking days, beers and expenses
- [ ] Add compact cross-module alcohol statistics

## v0.7.4A–D — Work Time Analytics

- [x] Classify session time across standard, additional and weekend boundaries
- [x] Calculate weekday standard-hours ratings from 2026-W31
- [x] Show weekly time categories, average rating and best day
- [x] Document the dynamic Work time analytics model
