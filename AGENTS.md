# CHB Agent Instructions

> Generated file. Canonical project data lives in `docs/data`.

## Required reading

- `docs/AI_CONTEXT.md`
- `docs/PROJECT_STATE.json`
- `docs/AI_PROJECT_INTERFACE.json`

## Current state

- Version: `0.5.6`
- Sprint: `0.5.6`

## Mandatory rules

- Read generated context before changing code.
- Treat docs/data as the documentation source of truth.
- Do not manually edit generated documentation or adapter files.
- Preserve local-first behavior and cloud conflict protection.
- Run npm run release:prepare before proposing a release commit.
- State assumptions and do not invent missing project facts.

## Project principles

- Local-first and offline-capable
- Cloud synchronization must not silently overwrite conflicts
- Daily WorkDay records are the source of truth for work data
- Tables are the primary daily work interface
- Preferences use the centralized app settings layer
- Generated Markdown is output; docs/data JSON is the source of truth
- AI integration must remain vendor-neutral
- The application must remain usable on older hardware

## Verification

- During development: `npm run format`, `npm run lint`, `npm run build`.
- Before a release commit: `npm run release:prepare`.
