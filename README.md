# wf-third

Full-stack application: a **Spring Boot** (hexagonal, multi-module Maven) backend and an **Angular** (standalone +
signals) frontend, in a single monorepo.

## Stack & prerequisites

| Component | Tech | Version |
|-----------|------|---------|
| Backend   | Java + Spring Boot + Maven | Java **21**, Spring Boot **4.1** (via the committed wrapper) |
| Frontend  | Angular + TypeScript + PrimeNG | Angular **21**, Node **LTS** (built on Node 24) |
| Database  | H2 in-memory (dev/test) | — |

Install locally: **JDK 21** and **Node LTS** (with npm). Maven is not required globally — the `backend/mvnw` wrapper
pins the version.

## How to run

Backend and frontend run as two processes. Start the backend first.

### Backend — `http://localhost:8080`

```bash
cd backend
./mvnw -pl service -am spring-boot:run
```

- API base: `http://localhost:8080`
- H2 console (dev only): `http://localhost:8080/h2-console` — JDBC URL `jdbc:h2:mem:appdb`, user `sa`, empty password.

### Frontend — `http://localhost:4200`

```bash
cd frontend
npm install
npm start          # ng serve, with the dev proxy already wired
```

The dev proxy (`frontend/proxy.conf.json`, wired into `angular.json`) forwards `/api/*` from `:4200` to the backend on
`:8080`, so the browser only ever makes same-origin calls (no CORS config needed). The frontend reads its API base from
`src/environments/environment.ts` (`apiBaseUrl: '/api'`).

## Repository layout

```
backend/    Spring Boot reactor (pom.xml, eclipse-formatter.xml, mvnw)
  business/   framework-free domain + ports (port/in, port/out)
  service/    Spring Boot app: application, adapter/in (+dto), adapter/out, config
frontend/   Angular app (package.json, eslint.config.mjs, proxy.conf.json)
  src/app/    core/ (services, models, interceptors), features/, shared/ (app-shell, ui)
  e2e/        Playwright specs
.githooks/  tracked git hooks (pre-commit, commit-msg, post-commit)
.github/workflows/ci.yml   CI gate
CLAUDE.md   coding conventions (authoritative)
```

## Architecture

- **Backend — hexagonal (ports & adapters), 2 Maven modules.** `business` is the framework-free core (domain objects +
  `port/in` use-case interfaces + `port/out` outbound ports); `service` is the Spring Boot composition root
  (`application/` use-case impls, `adapter/in` REST controllers + DTO records, `adapter/out` JPA entities +
  repositories, `config`). `service` depends on `business`; `business` depends on nothing. Schema is owned by
  **Liquibase** (SQL changelogs under `service/.../db/changelog`); Hibernate runs with `ddl-auto: none`.
- **Frontend — standalone components + signals + `inject()`** (no NgModules). Smart/presentational split: containers
  hold state and fetch via the `core/` `ApiService`; presentational components use `input()`/`output()`. PrimeNG (Aura
  theme) for UI. HTTP errors are normalized to a shared `ApiError` by an interceptor.

## Testing

```bash
# Backend — Spotless check + JUnit/Mockito/AssertJ (H2 slice + unit tests)
cd backend && ./mvnw test

# Frontend — ESLint + Vitest unit tests
cd frontend && npx eslint . && npm test -- --watch=false

# Frontend — Playwright e2e (drive the running app; start backend + frontend first)
cd frontend && npx playwright test
```

CI (`.github/workflows/ci.yml`) runs the backend and frontend gates on every push/PR to `main`.

## Conventions

All coding conventions are in **[CLAUDE.md](./CLAUDE.md)** (authoritative for human- and AI-written code): style
(4-space indent, 120 columns; formatters own it — Spotless for Java, ESLint/@stylistic for TS), architecture, and
testing rules.

- **Commit messages** use a bracket-tag scheme, enforced by the `commit-msg` hook:
  - Foundational: `[scaffold]` `[arch]` `[ci]` `[chore]` `[docs]` `[refactor]`
  - Feature: `[<slug>][impl|test|fix|docs|refactor]` — e.g. `[accounts][impl] add list endpoint`
- **Git hooks** live in tracked `.githooks/` (`git config core.hooksPath .githooks`, set once after clone):
  - `pre-commit` — one-commit-one-component + fast format/compile checks (Spotless + `tsc`/ESLint; no test suites).
  - `commit-msg` — enforces the tag scheme above.
  - `post-commit` — optional, non-blocking live/e2e loop (unarmed until a feature adds `.ai-scaffold/live-tests.sh`).
- **One commit = one component**: never mix `backend/` and `frontend/` changes in one commit.
