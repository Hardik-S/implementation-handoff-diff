# Implementation Handoff Diff

Implementation Handoff Diff is a fixture-first product workbench for catching product-to-engineering handoff loss before it turns into sprint churn. The first slice compares synthetic discovery notes, PRD excerpts, and engineering scope, then surfaces contradictions, missing owners, changed requirements, and a repair memo.

## Portfolio Signal

This project demonstrates product judgment, implementation scoping, and evidence-backed communication. It is intentionally not another generic planner: the useful output is a reviewer-ready diff that shows where the handoff changed, who needs to decide, and what engineering should refuse to treat as committed scope until repaired.

## Synthetic Data Boundary

All artifacts in `src/data/handoff.ts` are invented. The repo includes no real customer notes, company strategy, PRDs, credentials, private roadmap content, or personal data. The public repository is safe because every artifact is deterministic synthetic fixture data.

## Stack Rationale

- Vite + React + TypeScript keeps the demo fast, static, and easy to deploy on Vercel.
- Fixture-first data makes the product auditable without API keys or private documents.
- Vitest covers the deterministic classification logic so the UI is not just a static mock.
- Plain CSS keeps the first slice portable for future workers and fixers.

## Local Setup

```powershell
npm ci
npm run test -- --run
npm run build
npm run preview
```

## File Map

- `src/data/handoff.ts`: synthetic discovery, PRD, and implementation-scope artifacts.
- `src/lib/handoffDiff.ts`: topic grouping, contradiction classification, missing-owner detection, and repair memo generation.
- `src/lib/handoffDiff.test.ts`: regression tests for contradictions, owner gaps, and memo guidance.
- `src/App.tsx`: product surface that presents artifacts, diff findings, source trail, and repair memo.
- `src/styles.css`: compact workbench styling for desktop and mobile.

## Decision Log

- Chose a static Vite app because the first slice proves handoff reasoning, not live document ingestion or model calls.
- Kept output deterministic so reviewers can inspect exactly why each contradiction was flagged.
- Treated missing ownership as its own risk instead of folding it into contradictions; in real handoffs, owner ambiguity often blocks repair even when the requirement text is otherwise clear.
- Used a repair memo as the main artifact because the portfolio value is in making a build-safe next action obvious.

## Verification

Expected verification for this slice:

```powershell
npm ci
npm run test -- --run
npm run build
```

The worker run should also smoke the built or previewed app for `Implementation Handoff Diff`, `Import source`, and `Handoff repair memo`.

## Vercel

Production alias: `https://implementation-handoff-diff.vercel.app`.

Initial deployment: `https://implementation-handoff-diff-ojjo4fqda-batb4016-9101s-projects.vercel.app`.

Inspect URL: `https://vercel.com/batb4016-9101s-projects/implementation-handoff-diff/9PdymVwTAUMmLYh8ZBmJ4C1o3hP3`.

The first deployment used `npx --yes vercel@latest --prod --yes --name implementation-handoff-diff` from the PPQ worktree so Vercel would use the intended public project name instead of the long automation worktree folder.
