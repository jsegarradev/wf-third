# Project Conventions

> These conventions govern all code — human- or AI-written. AI output that violates them is wrong and must be corrected.

## Stack
- Backend: Java 21, **Spring Boot (whatever version start.spring.io serves — do not assume a major; read it from the generated pom)**, Maven.
- Frontend: Angular (standalone + signals), TypeScript, Node LTS.
- DB (dev/test): H2 in-memory.

## Repository layout
```
backend/    Spring Boot (pom.xml, eclipse-formatter.xml, src/)
frontend/   Angular (package.json, eslint.config.mjs, src/)
.github/workflows/ci.yml
```

## Coding style
- **4-space indentation**, **K&R / 1TBS braces**, **120-column** width, Java and TS. No tabs.
- TypeScript: single quotes, trailing commas (multiline), semicolons.
- **The formatters are the single source of truth — there are no hand-followed style rules on top.**
  - Java: `mvn spotless:apply` (Eclipse profile). Backend code is correct iff `spotless:check` passes.
  - TS/HTML: `npx eslint . --fix` (typescript-eslint + angular-eslint + @stylistic recommended). Frontend code is correct iff `eslint .` passes.
- Run the fixer, commit its output, don't argue with it. Wrapping, alignment, and close-paren placement are whatever the tool emits.

### Code rules (semantic — the formatter does NOT catch these; you must)
- **TypeScript is always explicitly typed.** No implicit or explicit `any`; annotate parameters, return types, and public members; type API models. Lean on `strict` — untyped code is wrong even if it lints.
- **Java: no `var`** (and no other ambiguous/implicit declarations) — declare the explicit type. Prefer `final` for locals/params that don't change.
- **No magic strings or numbers, anywhere (TS and Java).** Extract them into named constants; use an **enum** when the value is one of a fixed, known set (statuses, types, modes). Route keys, config keys, status codes, limits, labels — all named, never inline literals.

## Git
- **Trunk-based:** small commits straight to `main`.
- **Commit → push → green-CI protocol (every commit):** commits are **human-reviewed before they land** (show the diff, get a go — no autonomous commits). **Every commit is pushed immediately.** Once CI exists, a commit isn't "done" until its GitHub Action is **green** — if it's red, fix and re-push, **loop until green; never proceed on a red pipeline.**
- **Identity:** commit as the real author, **no `Co-Authored-By` trailer**.
- **Commit messages (bracket-tag scheme — enforced by commit-msg hook):**
  - Foundational: `[scaffold]` `[arch]` `[ci]` `[chore]` `[docs]`
  - Feature: `[<feature-slug>][type]` where slug is kebab-case and type ∈ `impl` `test` `fix` `docs` `refactor` (`[refactor]` also standalone).
  - Examples: `[scaffold] init spring boot + angular`, `[accounts][impl] list endpoint`, `[transfers][test] service slice tests`.
- **One commit = one component (monorepo):** never stage backend + frontend changes in the same commit — split them. Root-level files (CLAUDE.md, README) may accompany either. Enforced by the pre-commit hook.

## Backend architecture
**Hexagonal (ports & adapters), multi-module Maven — 2 modules:** `business` (domain objects + `port/in`/`port/out`, framework-free core), `service` (Spring Boot app: `application/` use-case impls, `adapter/in` REST controllers + API DTO records, `adapter/out` JPA entities + repositories, `config`, composition root). `service` depends on `business`; `business` depends on nothing.
- Placement: **domain objects → `business`**, **API DTOs → `service/adapter/in/dto`** (hand-written records; OpenAPI codegen opt-in), **JPA entities → `service/adapter/out`** (mapped to/from domain).
- Controllers thin (HTTP only), returning DTOs; logic in `@Transactional` use-case services; outbound access via `port/out` interfaces.
- Constructor injection. `@RestControllerAdvice` for errors. Bean Validation on inputs. Cross-origin in dev is handled by the frontend dev proxy (no backend CORS config unless you bypass it).
- Schema via **Liquibase** (SQL formatted changelogs, sole schema owner); Hibernate `ddl-auto: none` (does not touch/validate the schema). Seed data, *when a feature needs it*, is loaded in Java (e.g. a `CommandLineRunner`) into the Liquibase-created tables — never `data.sql`/direct-DB.

## Frontend architecture
- Standalone components + signals + `inject()` (no NgModules).
- **Smart/presentational split:** containers hold state (signals) + fetch via a `core/` HttpClient service; presentational components use `input()`/`output()`.
- Typed models, handle loading/empty/error states.

## Testing
- Backend: JUnit 5 + Mockito + AssertJ; H2 slice tests (`@DataJpaTest`, `@WebMvcTest`) + service unit tests.
- Frontend: Jasmine/Karma; ≥1 service spec (`HttpTestingController`) and/or component render spec.
- Tests must be green before every commit and in CI. They exist to verify AI output isn't hallucinated — favor meaningful tests over count.

## AI usage
Use AI agents (Claude Code/Cursor) to scaffold, generate, and draft tests — but review every line. Do not commit code you can't explain. Architecture decisions are the human's; the AI executes them.
