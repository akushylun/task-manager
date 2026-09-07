# Git Workflow Examples

Complete examples for commits, PRs, and branches.

## Commit Messages

### Single feature
```
add status filter for task list
```

### Bug fix
```
clear error message on dialog close
```

### Refactor with context
```
extract task filtering into tasks selector
```

### Multiple files changed, single concern
```
add empty state for task list
```
Not:
```
add empty state component, update styles, add api call
```

### What NOT to do
```
# BAD: multi-line with bullet points
add status filter

- Added TaskFilter component
- Updated TaskList component
- Added new constants

# BAD: past tense
added status filter

# BAD: trailing period
add status filter.

# BAD: too vague
fix bug
```

---

## Pull Request Descriptions

### Simple PR

**Title:** `add status filter for task list`

```markdown
## What was done

- Added `TaskFilter` component with status buttons in `app/task-list/`
- Updated `task-list.ts` to filter tasks by selected status
- Added a `selectTasksByStatus` selector in `features/tasks/tasks.reducer.ts`

**Logic:** +127 −12
```

### PR with tests

**Title:** `add empty state for task list`

```markdown
## What was done

- Added `EmptyState` component with illustration and CTA button
- Updated `task-list.ts` to render `EmptyState` when no tasks match the filter
- Added empty state styles to `task-list.css`

**Logic:** +135 −8 | **Tests:** +68 −0

## Tests

`empty-state.spec.ts` (4 tests):
- Renders empty message and CTA button
- Navigates to create page on CTA click

`task-list.spec.ts` (2 tests):
- Shows empty state when tasks array is empty
- Shows empty state when filter matches no tasks
```

### PR with design rationale

**Title:** `persist task order across sessions`

```markdown
## What was done

- Added `order` column to `task.entity.ts` and a TypeORM migration
- Created `reorderTasks` action and effect in `features/tasks/`
- Updated `task-list.ts` drag-and-drop handler to dispatch `reorderTasks`
- Added `PATCH /tasks/reorder` endpoint in `tasks.controller.ts`

**Logic:** +189 −14

**Why a server-side `order` column over client-side sorting:**

- **localStorage ordering** — does not survive a device change, diverges per browser
- **Sort by `updatedAt`** — reordering would require touching every task on each drag
- **Explicit `order` column** — survives sessions and devices, one write per moved task

## Tests

`tasks.effects.spec.ts` (3 tests):
- Dispatches reorder success on API 200
- Rolls back optimistic order on API error
```

### Bug fix PR

**Title:** `clear error message on dialog close`

```markdown
## What was done

- Fixed error state not resetting when the task dialog closes in `task-actions-dialog.ts`
- Removed redundant effect causing re-renders in `task-card.ts`

**Logic:** +6 −11
```

### Refactor PR

**Title:** `simplify tasks data service`

```markdown
## What was done

- Extracted shared request options to `core/api-url.ts`
- Simplified error handling in `tasks-data.service.ts`
- Removed unused helpers from `core/tasks/`

**Logic:** +45 −89
```

### What NOT to do in PR descriptions

```markdown
# BAD: too vague
## What was done
- Updated components
- Fixed some bugs

# BAD: obvious/filler bullets
## What was done
- Updated imports
- Fixed linting errors
- Ran prettier

# BAD: more than 7 bullets
## What was done
- Changed line 42 in task-card.ts
- Changed line 55 in task-card.ts
- Changed line 12 in task-list.ts
- ...etc

# BAD: including alternatives without asking the user
## What was done
- Added caching layer
**Why NgRx entity over a plain array:**
- ...
(should have asked the user if they want this section)
```

---

## Branch Names

```
feat/task-due-dates
fix/login-redirect-loop
refactor/tasks-effects
test/auth-guard-coverage
```

---

## Complete Workflow Example

Branch: `feat/task-status-filter`

**Commits on the branch:**
```
add TaskFilter component
integrate filter with task list
add status selector
```

**PR:**

Title: `add status filter for task list`

```markdown
## What was done

- Added `TaskFilter` component with clickable status buttons
- Updated `task-list.ts` to filter displayed tasks by status
- Added `selectTasksByStatus` selector in `features/tasks/tasks.reducer.ts`
- Updated `layout.ts` to pass filter state to the task list

**Logic:** +127 −12
```
