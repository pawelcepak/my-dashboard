# CHB Architecture Principles

## Single source of truth

Each stored value has exactly one owning domain module. Other modules consume that value through typed services or shared calculations instead of maintaining a second copy.

## Three questions before implementation

1. Which module owns this data?
2. Can the value be read from an existing module instead of being copied?
3. Does the new module create domain data, or only analyze existing data?

## Domain and analytical modules

- Work owns work days, beer counts, ratings, messages and work sessions.
- Portfolio owns financial accounts, tags and transactions.
- Alcohol is analytical: it reads beer counts from Work and expenses from Portfolio. It stores only historical values that predate source modules, manual overrides and linkage settings.
- Dashboard aggregates data and does not become a parallel database.

## Ecosystem requirements

Every new persistent table must be included in local migrations, backup, restore, cloud snapshots, fingerprints and timestamp comparison. Backward compatibility must be preserved through explicit normalization or migration.

## AI-agent rule

Future agents must extend existing owners and typed interfaces instead of creating parallel storage merely for convenience. Generated documentation is an adapter; canonical project knowledge remains in `docs/data/` and maintained architecture documents.
