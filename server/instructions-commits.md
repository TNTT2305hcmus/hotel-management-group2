# Conventional Commits Guide

## Format
```
<type>[optional scope]: <short description>

[optional body]

[optional footer(s)]
```
- Use imperative, lowercase, max ~72 chars for the subject.
- One change per commit; keep the scope small and meaningful.

## Types (common)
- feat: add a new feature
- fix: bug fix
- docs: documentation only changes
- style: formatting only (no code logic changes)
- refactor: code change that neither fixes a bug nor adds a feature
- perf: performance improvement
- test: add or fix tests
- build: build system or dependencies
- ci: CI configuration or scripts
- chore: maintenance tasks (no src/test changes) 
- revert: revert a previous commit

## Breaking changes
- Add a footer starting with `BREAKING CHANGE:` describing the impact.
- You can also mark in the type as `type!`, e.g. `feat!: drop legacy auth`.

## Footers
- Link issues or tickets, e.g. `Refs: #123` or `Closes: #123`.

## Examples
- `feat(auth): add JWT refresh tokens`
- `fix(booking): handle missing room type`
- `docs: add API runbook`
- `refactor: extract db pool factory`
- `perf(search): cache room availability`
- `build: bump express to 5.x`
- `ci: add lint workflow`
- `revert: revert "feat(auth): add JWT refresh tokens"`
