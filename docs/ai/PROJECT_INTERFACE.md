# CHB AI Project Interface

CHB exposes a vendor-neutral project interface generated from structured JSON.

## Contract

- Files in `docs/data` are canonical.
- Generated Markdown, manifests and provider adapters are disposable outputs.
- Providers must not create independent project facts in adapter files.

## Reading order

1. `docs/AI_CONTEXT.md`
2. `docs/PROJECT_STATE.json`
3. `docs/AI_PROJECT_INTERFACE.json`
4. `docs/data/current-context.json`
5. `docs/data/decisions.json`
6. `docs/data/modules.json`

## Generated adapters

- `AGENTS.md` — generic coding agents
- `CLAUDE.md` — Claude-compatible coding tools
- `.cursor/rules/chb-project.mdc` — Cursor

## Adding another provider

Add a generated adapter definition and renderer. Do not duplicate or move canonical data out of `docs/data`.
