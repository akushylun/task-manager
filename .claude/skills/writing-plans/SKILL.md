---
name: writing-plans
description: "Use when you have an approved design or feature spec and need to create a step-by-step implementation plan. Activates after brainstorming/design approval. Breaks work into small, verifiable tasks."
---

# Writing Implementation Plans

Create detailed, step-by-step implementation plans from approved designs or feature specs.

## When This Activates

After a design is approved (from brainstorming skill or user-provided spec) and before implementation begins. Also use when the user says "plan this" or "break this into tasks."

## Core Principles

1. **Audience:** Write for an enthusiastic junior engineer with no project context. Be explicit about everything.
2. **Task size:** Each task should take 2-5 minutes. If it takes longer, split it.
3. **Verifiable:** Every task has a verification step — how do you know it's done?
4. **Sequential:** Tasks are ordered so each builds on the previous one. No forward references.
5. **Complete:** Include exact file paths, function signatures, and code patterns. No ambiguity.

## Plan Structure

Write the plan to `docs/plans/YYYY-MM-DD-<name>.md`:

```markdown
# Implementation Plan: <Feature Name>

## Goal
<1-2 sentence summary of what we're building>

## Architecture Overview
<Brief description of how the pieces fit together>

### Files to Create
- `path/to/new/file.js` — purpose

### Files to Modify
- `path/to/existing/file.js` — what changes

---

## Tasks

### Task 1: <Short descriptive title>

**File:** `path/to/file.js`

**What to do:**
1. Step-by-step instructions
2. Include exact code to write or change
3. Reference existing patterns in the codebase

**Verification:**
- [ ] How to verify this task is complete
- [ ] What to check (e.g., "app compiles without errors")

---

### Task 2: <Short descriptive title>

...
```

## Task Writing Rules

### Be Explicit
- Include the exact file path
- Show the code to write (not "add a function that does X")
- Reference existing patterns ("follow the same pattern as `transaction-list.component.ts`")
- Specify imports that are needed

### Be Small
Each task should be ONE of:
- Create a single file with a clear purpose
- Add a single function or component
- Modify one section of an existing file
- Write a failing test, then make it pass (TDD pair)

If a task requires changing multiple files, split it into separate tasks.

### Be Verifiable
Every task needs a way to verify completion:
- "Run `ng serve` — app compiles without errors"
- "Visit `http://localhost:4200/payments` — new component renders"
- "Run `ng test` — all tests pass"
- "Verify the form submits and shows success toast"
- "Verify no console errors in browser dev tools"

### Task Types

**Shared / Infrastructure:**
1. Interfaces and data models
2. Constants and configuration
3. Utility functions and pipes

**Services:**
1. API service methods (HttpClient calls)
2. State management (signals, stores)
3. Auth/interceptor changes

**Components:**
1. Presentational (dumb) components
2. Smart (container) components
3. Page-level components
4. Dialogs and overlays

**Integration:**
1. Route configuration
2. Guards and resolvers
3. Module/feature wiring

### Ordering

For Angular features, order tasks as:

1. **Interfaces & models** — TypeScript types, enums, DTOs
2. **Services** — API calls, state management
3. **Shared components** — reusable UI pieces
4. **Feature components** — smart components, pages
5. **Routing** — route config, guards, resolvers
6. **Polish** — error handling, loading states, edge cases

## Anti-Patterns

- **Vague tasks:** "Implement the feature" is not a task. Be specific.
- **Giant tasks:** If a task has more than 5 steps, split it.
- **Missing paths:** Always include exact file paths.
- **No verification:** Every task needs a way to check it's done.
- **Forward references:** Task 3 should not depend on Task 5.
- **Mixing concerns:** One task = one file = one concept.

## Example

```markdown
### Task 3: Create task filter component

**File:** `frontend/src/app/task-list/task-filter/task-filter.ts`

**What to do:**
1. Generate component with `ng g c task-list/task-filter`
2. Inject `Store` and expose `status = input.required<TaskStatus>()`
3. Add a `select(status: TaskStatus)` method that dispatches `tasksActions.filterByStatus({ status })`
4. Follow the existing pattern in `task-card.ts`

**Verification:**
- [ ] Component renders a button per task status
- [ ] Clicking a status dispatches `filterByStatus` and narrows the visible list
- [ ] Empty state message shows when no tasks match the selected status
```

## Remember

- Plans are living documents — update them as implementation reveals issues
- A good plan makes implementation nearly mechanical
- If you're unsure about a detail, note it as an open question rather than guessing
- The plan should be complete enough that someone new to the project can follow it
