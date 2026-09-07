---
name: git-workflow
description: "Git workflow conventions for branches, commits, and PRs. Use when creating branches, generating commit messages, creating pull requests, or any Git operation that needs to follow project conventions. Covers branch naming, PR formatting, and pre-push build checks."
---

# Git Workflow

Conventions for Git operations in this project.

For complete examples of commits, PRs, and branches, see [examples.md](references/examples.md).

## CRITICAL: Commit & Push Policy

- **NEVER commit or push unless the user EXPLICITLY and DIRECTLY asks for it**
- **ONE commit or push per explicit request** — do not batch, retry, or repeat
- After making code changes, WAIT for the user to say "commit" or "push"
- This applies in ALL scenarios: bug fixes, PR review comments, feature work, refactors
- If a commit fails (e.g., pre-commit hook), fix the issue and WAIT for the user to ask again
- NEVER auto-commit as part of completing a task

## Message Format

All commits and PR titles use a short imperative description:

```
<short description>
```

- Imperative mood, under 72 chars, no trailing period, lowercase
- Keep to 1 line (2 max) — no bullet-point lists in commit messages

Examples:
- `add title grouping for tasks`
- `clear error message on dialog close`
- `simplify task filtering logic`

## Branch Naming

Branches are cut from `main` and named `<type>/<short-description>` in kebab-case:

```
<type>/<short-description>
```

Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`

Examples:
- `feat/task-due-dates`
- `fix/login-redirect-loop`
- `refactor/tasks-effects`

## PR Description Format

Every PR description follows this structure. Sections marked *(conditional)* are only included when applicable.

```markdown
## What was done

- <Action verb> <specific change> in `<filename>`
- <Action verb> <specific change>

**Logic:** +<src_ins> −<src_del> | **Tests:** +<test_ins> −<test_del>

**Why `<approach>` over alternatives:** *(optional — only if complex, ASK the user first)*

- **<Alternative 1>** — why it doesn't work or was rejected
- **<Alternative 2>** — why it doesn't work or was rejected
- **<Chosen approach>** — why this was selected, how it works

## Tests *(conditional — only if PR includes test changes)*

`<feature.spec.ts>` (N tests):
- <What the tests cover>
- <Key scenarios tested>

`<another.spec.ts>` (N tests):
- <What the tests cover>
```

### Section Rules

**What was done:**
- Be file-specific — mention actual file/component names
- Start with action verbs: Added, Removed, Fixed, Updated, Refactored, Created
- One change per bullet, max 5-7 bullets
- Use backticks for file names and code references

**Why (alternatives) section:**
- Include ONLY when the PR involves a non-trivial design decision
- Before writing this section, **ASK the user** whether they want to document alternatives and the reasoning
- List rejected approaches with short explanations of why they don't apply
- End with the chosen approach and its benefits
- Use bold for approach names, em-dash for explanations

**Tests section:**
- Include when the PR adds or modifies test files
- List each test file with the number of tests in parentheses
- Under each file, summarize what's tested (not individual test names)

### Change Stats

When creating the PR, compute line-level change stats split by source vs test code:

```bash
# Total stats
git diff main...HEAD --stat | tail -1

# Test file stats (*.spec.ts)
git diff main...HEAD -- '*.spec.ts' --stat | tail -1

# Source = total minus test
```

Include a summary line after "What was done" bullets:

```markdown
**Logic:** +280 −78 | **Tests:** +67 −11
```

- **Logic** = lines changed in non-test files (features, fixes, refactors)
- **Tests** = lines changed in `*.spec.ts` files
- If no test files changed, show only Logic: `**Logic:** +347 −89`

## GitHub Operations

- **Use the GitHub MCP tools as the primary method** for all GitHub operations (creating PRs, listing PRs, adding comments, etc.)
- Fall back to the `gh` CLI only if MCP tools are unavailable or fail

## Push Policy

- **NEVER push changes unless the user explicitly asks to push**
- Before pushing, always ask the user for confirmation first
- If the user asks to push, build whichever workspace changed to catch errors:

```bash
# frontend changes
cd frontend && npm run build

# backend changes
cd backend && npm run build
```

Only push if the build succeeds. The IDE may not show all errors.
